interface PlayerState {
    isHolding: boolean
    isHoldingEntityName: string | null
}

export const state : PlayerState = {
    isHolding: false,
    isHoldingEntityName: null,
}
