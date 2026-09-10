/**
 * Curated high-resolution fallback photography for civic problems & fundraisers
 */

const CATEGORY_IMAGES: Record<string, string> = {
  water: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
  education: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  health: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  infrastructure: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
}

const PROBLEM_ID_IMAGES: Record<string, string> = {
  '11111111-1111-1111-1111-111111111111': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
  '22222222-2222-2222-2222-222222222222': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
  '33333333-3333-3333-3333-333333333333': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  '44444444-4444-4444-4444-444444444444': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
  '55555555-5555-5555-5555-555555555555': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
}

export function getProblemImage(problem?: { id?: string; category?: string; image_url?: string | null }): string {
  if (problem?.image_url && problem.image_url.trim() !== '') {
    return problem.image_url
  }
  if (problem?.id && PROBLEM_ID_IMAGES[problem.id]) {
    return PROBLEM_ID_IMAGES[problem.id]
  }
  if (problem?.category && CATEGORY_IMAGES[problem.category.toLowerCase()]) {
    return CATEGORY_IMAGES[problem.category.toLowerCase()]
  }
  return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80'
}
