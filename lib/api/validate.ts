import z, { ZodError } from 'zod';

function formatZodErrors(err: ZodError): { field: string; message: string }[] {
   return err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
   }));
}

export async function parseBody<T>(req: Request, schema: z.ZodType<T>) {
   const body = await req.json();
   const parsed = schema.safeParse(body);

   if (!parsed.success) {
      return { data: null, error: formatZodErrors(parsed.error) };
   }

   return { data: parsed.data, error: null };
}
