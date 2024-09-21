import { useDispatch as _useDispatch, useSelector as _useSelector } from '@aiszlab/bee/storage'
import type { AppDispatch, RootState } from '../storage/index'

export const useDispatch = _useDispatch.withTypes<AppDispatch>()
export const useSelector = _useSelector.withTypes<RootState>()
