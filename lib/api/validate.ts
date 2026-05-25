import z, { ZodError } from 'zod';

function formatZodErrors(err: ZodError): { field: string; message: string }[] {
   return err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
   }));
}

type ParseSuccess<T> = { data: T; error: null };
type ParseFailure = { data: null; error: { field: string; message: string }[] };
type ParseResult<T> = ParseSuccess<T> | ParseFailure;

export async function parseBody<T>(
   req: Request,
   schema: z.ZodType<T>
): Promise<ParseResult<T>> {
   let body: unknown;

   try {
      body = await req.json();
   } catch {
      return {
         data: null,
         error: [{ field: '', message: 'Invalid JSON body' }],
      };
   }

   const parsed = schema.safeParse(body);

   if (!parsed.success) {
      return { data: null, error: formatZodErrors(parsed.error) };
   }

   return { data: parsed.data, error: null };
}
