'use server';

/**
 * @fileOverview Converts a curl command to Python code using the requests library.
 *
 * - curlToPythonConversion - A function that handles the conversion process.
 * - CurlToPythonConversionInput - The input type for the curlToPythonConversion function.
 * - CurlToPythonConversionOutput - The return type for the curlToPythonConversion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurlToPythonConversionInputSchema = z.object({
  curlCommand: z.string().describe('The curl command to convert to Python.'),
});
export type CurlToPythonConversionInput = z.infer<typeof CurlToPythonConversionInputSchema>;

const CurlToPythonConversionOutputSchema = z.object({
  pythonCode: z.string().describe('The equivalent Python code using the requests library.'),
});
export type CurlToPythonConversionOutput = z.infer<typeof CurlToPythonConversionOutputSchema>;

export async function curlToPythonConversion(input: CurlToPythonConversionInput): Promise<CurlToPythonConversionOutput> {
  return curlToPythonConversionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curlToPythonConversionPrompt',
  input: {schema: CurlToPythonConversionInputSchema},
  output: {schema: CurlToPythonConversionOutputSchema},
  prompt: `You are a expert software developer, and convert curl commands to Python code using the requests library.

  Here is the curl command to convert:
  {{{curlCommand}}}

  Return only the Python code, and do not include any other text.  Make sure the Python code is properly formatted and easy to read.
  `,
});

const curlToPythonConversionFlow = ai.defineFlow(
  {
    name: 'curlToPythonConversionFlow',
    inputSchema: CurlToPythonConversionInputSchema,
    outputSchema: CurlToPythonConversionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
