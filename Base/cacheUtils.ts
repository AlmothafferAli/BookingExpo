import { apiSlice } from "./apiSlice";

const getQueryEntries = (endpointName: string, state: any) => {
    const apiState = state.api.queries
    return Object.entries(apiState).filter(([key]) =>
        key === endpointName || key.startsWith(`${endpointName}(`)
    )
}

export const handleManualUpdate = async (
    endpointName: string,
    itemId: string,
    api: any,
    optimisticData?: any
) => {
    const { dispatch, queryFulfilled, getState } = api
    let patches: any[] = []

    const apply = (data: any) => {
        const state = getState() as any
        const entries = getQueryEntries(endpointName, state)
        return entries.map(([key, queryState]: [string, any]) => {
            return dispatch(
                (apiSlice.util.updateQueryData as any)(endpointName, queryState.originalArgs, (draft: any) => {
                    const list = Array.isArray(draft) ? draft : draft?.data
                    if (Array.isArray(list)) {
                        const index = list.findIndex((item: any) => item.id === itemId)
                        if (index !== -1) {
                            list[index] = { ...list[index], ...data }
                        }
                    } else if (draft && draft.id === itemId) {
                        Object.assign(draft, data)
                    }
                })
            )
        })
    }

    if (optimisticData) {
        patches = apply(optimisticData)
    }

    try {
        const { data: updatedItem } = await queryFulfilled
        apply(updatedItem)
    } catch {
        patches.forEach(p => p.undo())
    }
}

export const handleManualDelete = async (
    endpointName: string,
    itemId: string,
    api: any
) => {
    const { dispatch, queryFulfilled, getState } = api

    const state = getState() as any
    const entries = getQueryEntries(endpointName, state)

    // Apply optimistic delete
    const patches = entries.map(([key, queryState]: [string, any]) => {
        return dispatch(
            (apiSlice.util.updateQueryData as any)(endpointName, queryState.originalArgs, (draft: any) => {
                const list = Array.isArray(draft) ? draft : draft?.data
                if (Array.isArray(list)) {
                    const index = list.findIndex((item: any) => item.id === itemId)
                    if (index !== -1) {
                        list.splice(index, 1)
                        if (draft.totalCount !== undefined) draft.totalCount -= 1
                    }
                }
            })
        )
    })

    try {
        await queryFulfilled
    } catch {
        // Rollback on error
        patches.forEach(p => p.undo())
    }
}

export const handleManualCreate = async (
    endpointName: string,
    api: any,
    optimisticData?: any,
    appendToStart = true
) => {
    const { dispatch, queryFulfilled, getState } = api
    let patches: any[] = []

    // If optimistic data is provided, add it with a temp ID
    if (optimisticData) {
        const state = getState() as any
        const entries = getQueryEntries(endpointName, state)
        const tempItem = { ...optimisticData, id: 'temp-' + Date.now(), isPending: true }

        patches = entries.map(([key, queryState]: [string, any]) => {
            return dispatch(
                (apiSlice.util.updateQueryData as any)(endpointName, queryState.originalArgs, (draft: any) => {
                    const list = Array.isArray(draft) ? draft : draft?.data
                    if (Array.isArray(list)) {
                        if (appendToStart) list.unshift(tempItem)
                        else list.push(tempItem)
                        if (draft.totalCount !== undefined) draft.totalCount += 1
                    }
                })
            )
        })
    }

    try {
        const { data: newItem } = await queryFulfilled

        // Remove temp item if it exists and add the real one
        const state = getState() as any
        const entries = getQueryEntries(endpointName, state)

        entries.forEach(([key, queryState]: [string, any]) => {
            dispatch(
                (apiSlice.util.updateQueryData as any)(endpointName, queryState.originalArgs, (draft: any) => {
                    const list = Array.isArray(draft) ? draft : draft?.data
                    if (Array.isArray(list)) {
                        // Remove temp item if we added one
                        if (optimisticData) {
                            const tempIndex = list.findIndex((item: any) => item.isPending)
                            if (tempIndex !== -1) list.splice(tempIndex, 1)
                            if (draft.totalCount !== undefined) draft.totalCount -= 1
                        }

                        // Add the real item (check for duplicates)
                        const exists = list.some((item: any) => item.id === newItem.id)
                        if (!exists) {
                            if (appendToStart) list.unshift(newItem)
                            else list.push(newItem)
                            if (draft.totalCount !== undefined) draft.totalCount += 1
                        }
                    }
                })
            )
        })
    } catch {
        // Rollback optimistic add
        patches.forEach(p => p.undo())
    }
}
