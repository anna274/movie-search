import { MovieProvider } from '../src/js/MovieProvider';

const fetchMock = require('fetch-mock');

describe('Testing get first page function', () => {
  it('Check valid search. Should return object', async () => {
    fetchMock.get('https://www.omdbapi.com/?s=dream&type=movie&apikey=bf038eea', { Response: 'True', Search: [{ Title: '1', imdbID: 1 }] });
    const provider = new MovieProvider('bf038eea');
    const movies = await provider.getFirstPage('dream');
    expect(movies.Search.length).toBeGreaterThan(0);
  });
  it('Check invalid search. Should throw error "No results for fff"', async () => {
    fetchMock.get('https://www.omdbapi.com/?s=fff&type=movie&apikey=bf038eea', { Response: 'False', Search: [] });
    const provider = new MovieProvider('bf038eea');
    try {
      await provider.getFirstPage('fff');
    } catch (error) {
      expect(error.message).toEqual('No results for fff');
    }
  });
});
