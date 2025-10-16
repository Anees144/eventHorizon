'use server';
/**
 * @fileOverview An AI agent that recommends events based on a user's interests.
 *
 * - recommendEventsBasedOnUserInterest - A function that recommends events to a user.
 * - RecommendEventsInput - The input type for the recommendEventsBasedOnUserInterest function.
 * - RecommendEventsOutput - The return type for the recommendEventsBasedOnUserInterest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendEventsInputSchema = z.object({
  userProfile: z
    .string()
    .describe('The user profile, including their interests.'),
  availableEvents: z
    .string()
    .describe('A list of available events with their descriptions.'),
});
export type RecommendEventsInput = z.infer<typeof RecommendEventsInputSchema>;

const RecommendEventsOutputSchema = z.object({
  recommendedEvents: z
    .array(z.string())
    .describe('A list of titles of events recommended for the user. Only return the titles.'),
});
export type RecommendEventsOutput = z.infer<typeof RecommendEventsOutputSchema>;

export async function recommendEventsBasedOnUserInterest(
  input: RecommendEventsInput
): Promise<RecommendEventsOutput> {
  return recommendEventsBasedOnUserInterestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendEventsBasedOnUserInterestPrompt',
  input: {schema: RecommendEventsInputSchema},
  output: {schema: RecommendEventsOutputSchema},
  prompt: `You are an AI event recommendation system.

  Based on the user profile and available events, recommend up to 6 events that the user would be interested in. Only return the event titles in the response.

  User Profile: {{{userProfile}}}
  Available Events: {{{availableEvents}}}
  
  Do not include any other text in your response, only the list of event titles.
  `,
});

const recommendEventsBasedOnUserInterestFlow = ai.defineFlow(
  {
    name: 'recommendEventsBasedOnUserInterestFlow',
    inputSchema: RecommendEventsInputSchema,
    outputSchema: RecommendEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
