import data from '../../data/popos';

export async function get({ request }) {
  return {
    status: 200,
    Headers: {
      "Content-Type": "application/json"
    },
    body: data
  }
}