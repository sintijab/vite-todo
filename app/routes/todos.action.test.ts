import { action } from './todos';

function makeMockRequest(form: Record<string, string>): Request {
  const req = new Request('http://localhost', { method: 'POST' });
  // @ts-ignore
  req.formData = async () => ({
    get: (key: string) => form[key],
  });
  return req;
}

describe('todos action', () => {
  it('should add a todo with valid text', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'add', text: 'Test Action' }), params: {}, context: {} });
    expect(result).toEqual({ success: true });
  });

  it('should not add a todo with empty text', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'add', text: '' }), params: {}, context: {} });
    expect(result).toEqual({ success: true }); // No error, but nothing added
  });

  it('should toggle a todo with valid id', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'toggle', id: '1' }), params: {}, context: {} });
    expect(result).toEqual({ success: true });
  });

  it('should delete a todo with valid id', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'delete', id: '1' }), params: {}, context: {} });
    expect(result).toEqual({ success: true });
  });

  it('should move a todo with valid id and status', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'move', id: '1', target: 'done' }), params: {}, context: {} });
    expect(result).toEqual({ success: true });
  });

  it('should return error for invalid move status', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'move', id: '1', target: 'invalid' }), params: {}, context: {} });
    expect(result).toEqual({ error: 'Invalid status' });
  });

  it('should handle unknown intent gracefully', async () => {
    const result = await action({ request: makeMockRequest({ intent: 'unknown' }), params: {}, context: {} });
    expect(result).toEqual({ ok: true });
  });
});
