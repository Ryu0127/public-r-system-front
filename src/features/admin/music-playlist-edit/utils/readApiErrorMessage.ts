/**
 * API のエラーレスポンスから表示用メッセージを取り出す
 * バリデーションエラー（422）の場合は各項目のメッセージを連結して返す
 */
export const readApiErrorMessage = async (
  response: Response,
  defaultMessage: string
): Promise<string> => {
  try {
    const text = await response.text();
    if (!text) return defaultMessage;
    const body = JSON.parse(text);
    if (body?.errors && typeof body.errors === 'object') {
      const messages = Object.values(body.errors as Record<string, unknown>)
        .flatMap((v) => (Array.isArray(v) ? v : [v]))
        .map(String)
        .filter(Boolean);
      if (messages.length > 0) return messages.join(' / ');
    }
    if (body?.message) return String(body.message);
    if (body?.error) return String(body.error);
  } catch {
    // JSON でない場合はデフォルトメッセージ
  }
  return defaultMessage;
};
