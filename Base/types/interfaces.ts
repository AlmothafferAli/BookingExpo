export interface IpageResponse<T> {
    data: T[]
    pagesCount: number
    currentPage: number
    totalCount: number
    isLast: boolean
}

export interface IbaseFilter {
    pageNumber?: number
    pageSize?: number
    NameSearch?: string
}