const sortAssets = (assets, favorites) => {
    return assets.sort((a, b) => {
        // 1. 즐겨찾기 우선
        if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
        if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;

        // 2. 변동성(절댓값) 높은 순
        return Math.abs(b.changePercent) - Math.abs(a.changePercent);
    });
}