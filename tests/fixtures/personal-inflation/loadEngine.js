/**
 * T3 seam: engine is not in the tree yet. Import must stay static for Vite.
 */
export async function loadPiEngine() {
  const mod = await import('@/utils/personalInflationEngine')
  if (typeof mod.computePersonalInflation !== 'function') {
    throw new Error('computePersonalInflation is not exported from personalInflationEngine')
  }
  return mod
}
