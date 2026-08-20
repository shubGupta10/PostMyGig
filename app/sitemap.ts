import { MetadataRoute } from 'next'
import { ConnectoDatabase } from '@/lib/db'
import ProjectModel from '@/modules/gigs/models/ProjectModel'
import { getBaseUrl } from '@/lib/social-preview'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl()

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/view-gigs`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ]

  try {
    await ConnectoDatabase()

    const gigs = await ProjectModel.find({ status: 'active' })
      .select('_id updatedAt')
      .lean()

    const gigRoutes: MetadataRoute.Sitemap = gigs.map((gig) => ({
      url: `${baseUrl}/open-gig/${gig._id.toString()}`,
      lastModified: gig.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...routes, ...gigRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return routes
  }
}
