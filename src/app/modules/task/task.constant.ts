export type status = 'accept' | 'cancel' | 'process';

export const assignedStatus: status[] = ['accept', 'cancel', 'process'];

export type types = 'easy' | 'moderate' | 'difficult';

export const taskTypes: types[] = ['easy', 'moderate', 'difficult'];

export const taskFilterableField = [
  'searchTerm',
  'description',
  'name',
  'category',
  'deadLine',
];
export const taskSearchableField = [
  'searchTerm',
  'description',
  'name',
  'category',
];
