'use server'

import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string({
		invalid_type_error: 'Please select a customer',
	}),
	amount: z.coerce
		.number()
		.gt(0, { message: 'Please enter an amount greater than $0' }),
	status: z.enum(['pending', 'paid'], {
		invalid_type_error: 'Please select an invoice status',
	}),
	date: z.string(),
})
const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ date: true })
const DeleteInvoice = FormSchema.pick({ id: true })

// This is temporary until @types/react-dom is updated
export type State = {
	errors?: {
		customerId?: string[]
		amount?: string[]
		status?: string[]
	}
	message?: string | null
}

export async function createInvoice(prevState: State, formData: FormData) {
	// Validate fields using Zod
	const validatedFields = CreateInvoice.safeParse({
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	})

	// If form validation fails, return errors early. Otherwise continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Missing Fields. Failed to create invoice.',
		}
	}

	// Prepare data for insertion into database
	const { customerId, amount, status } = validatedFields.data
	const amountInCents = amount * 100
	const date = new Date().toISOString().split('T')[0]

	// Inssert data into database
	try {
		await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `
	} catch (error) {
		// If a database error occurs, return a more specific error
		return {
			message: 'Database Error: Failed to create invoice.',
		}
	}

	// revalidate de cache for the invoices page and redirect the user
	revalidatePath('/dashboard/invoices')
	redirect('/dashboard/invoices')
}

export async function updateInvoice(formData: FormData) {
	const { id, customerId, amount, status } = UpdateInvoice.parse({
		id: formData.get('id'),
		customerId: formData.get('customerId'),
		amount: formData.get('amount'),
		status: formData.get('status'),
	})
	const amountInCents = amount * 100

	try {
		await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
	  `
	} catch (error) {
		return {
			message: 'Database Error: Failed to update invoice.',
		}
	}

	revalidatePath('/dashboard/invoices')
	redirect('/dashboard/invoices')
}

export async function deleteInvoice(formData: FormData) {
	// throw new Error('Failed to delete invoice') example of error.tsx on invoices segment
	const { id } = DeleteInvoice.parse({
		id: formData.get('id'),
	})

	try {
		await sql`DELETE FROM invoices WHERE id = ${id}`
		revalidatePath('/dashboard/invoices')
		return { message: 'Deleted invoice.' }
	} catch (error) {
		return {
			message: 'Database Error: Failed to delete invoice.',
		}
	}
}
