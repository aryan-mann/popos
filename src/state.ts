import { writable, type Writable } from 'svelte/store';

export const location: Writable<[number, number]> | Writable<null> = writable(null);