import { prisma } from '~/server/utils/prisma'

async function main () {
  await prisma.audit.create({
    data: {
      url: 'https://exemple.fr',
      status: 'COMPLETED',
      score: 92.4,
      applicable: 120,
      validated: 111,
      options: {},
      criteria: {
        create: [
          {
            criterionId: '1.1.1',
            label: 'Texte alternatif',
            theme: 'Images',
            type: 'auto',
            wcag: '1.1.1',
            status: 'passed',
            description: 'Toutes les images possèdent un texte alternatif.',
            remediation: '—'
          },
          {
            criterionId: '3.2.1',
            label: 'Contraste texte/fond',
            theme: 'Couleurs',
            type: 'auto',
            wcag: '1.4.3',
            status: 'failed',
            description: 'Le bouton principal manque de contraste.',
            remediation: 'Augmenter le contraste à 4.5:1 minimum.'
          }
        ]
      },
      attestation: {
        create: {
          statusLabel: 'Partiellement conforme',
          scope: 'Site vitrine',
          score: 92.4,
          technologies: 'Nuxt, Tailwind, Playwright',
          limitations: 'PDF dynamiques en cours de correction',
          contact: 'accessibilite@exemple.fr',
          appeal: 'Défenseur des droits'
        }
      }
    }
  })
}

main().finally(() => prisma.$disconnect())
