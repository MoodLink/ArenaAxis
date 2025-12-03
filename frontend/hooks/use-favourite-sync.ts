/**
 * Hook để sync trạng thái yêu thích giữa các component
 * Khi thay đổi yêu thích ở một nơi, các nơi khác sẽ được update
 */

import { useEffect, useState } from 'react';

const FAVOURITE_CHANGE_EVENT = 'favouriteChanged';

export interface FavouriteChangeEvent {
    storeId: string;
    isFavourite: boolean;
}

/**
 * Listen to favourite changes from other components
 * @param storeId - ID của store để theo dõi
 * @param onFavouriteChange - Callback khi trạng thái yêu thích thay đổi
 */
export function useFavouriteSync(
    storeId: string,
    onFavouriteChange?: (isFavourite: boolean) => void
) {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleFavouriteChange = (event: Event) => {
            const customEvent = event as CustomEvent<FavouriteChangeEvent>;
            const { storeId: changedStoreId, isFavourite } = customEvent.detail;

            // Chỉ update nếu store ID match
            if (changedStoreId === storeId) {
                console.log(`Yêu thích của store ${storeId} đã thay đổi:`, isFavourite);
                onFavouriteChange?.(isFavourite);
            }
        };

        window.addEventListener(FAVOURITE_CHANGE_EVENT, handleFavouriteChange);

        return () => {
            window.removeEventListener(FAVOURITE_CHANGE_EVENT, handleFavouriteChange);
        };
    }, [storeId, onFavouriteChange]);
}

/**
 * Emit favourite change event để thông báo cho các component khác
 * @param storeId - ID của store
 * @param isFavourite - Trạng thái yêu thích mới
 */
export function emitFavouriteChange(storeId: string, isFavourite: boolean) {
    if (typeof window === 'undefined') return;

    const event = new CustomEvent<FavouriteChangeEvent>(FAVOURITE_CHANGE_EVENT, {
        detail: { storeId, isFavourite },
    });

    window.dispatchEvent(event);
    console.log(`Phát sự kiện yêu thích thay đổi:`, storeId, isFavourite);
}
