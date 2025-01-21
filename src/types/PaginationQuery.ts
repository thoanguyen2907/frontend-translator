export interface PaginationQuery {
    limit: number
    offset: number, 
    keyword: string,
    signal: AbortSignal
}
