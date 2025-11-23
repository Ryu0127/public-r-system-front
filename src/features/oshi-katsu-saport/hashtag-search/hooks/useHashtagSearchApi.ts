import { useCallback } from "react";
import { useTalentsGetApi } from "hooks/api/oshi-katsu-saport/useTalentsGetApi";
import { useTalentHashtagsGetApi } from "hooks/api/oshi-katsu-saport/useTalentHashtagsGetApi";

/**
 * ハッシュタグ検索画面API Hooks
 * @returns API操作関数
 */
export const useHashtagSearchApi = () => {
  // API Hooks
  const { executeTalentsGet } = useTalentsGetApi();
  const { executeTalentHashtagsGet } = useTalentHashtagsGetApi();

  return {
    // タレント一覧取得
    executeTalentsGet: useCallback(async () => {
      const result = await executeTalentsGet();
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeTalentsGet]),

    // タレント別ハッシュタグ取得
    executeTalentHashtagsGet: useCallback(async (id: string) => {
      const result = await executeTalentHashtagsGet(id);
      return {
        success: result.apiResponse?.status ?? false,
        data: result.apiResponse?.data
      };
    }, [executeTalentHashtagsGet]),
  };
};
