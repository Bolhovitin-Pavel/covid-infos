

export function GetPageCount(allItemCount, itemCountPerPage) {
    return Math.ceil(allItemCount / itemCountPerPage);
}


export function IsItemInPage(itemIndex, pageIndex, itemCountPerPage) {
    return ((itemIndex >= pageIndex * itemCountPerPage) && (itemIndex < (pageIndex + 1) * itemCountPerPage));
}
