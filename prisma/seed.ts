import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const trip = await prisma.trip.upsert({
    where: { slug: "accra-weekend-sample" },
    update: {},
    create: {
      slug: "accra-weekend-sample",
      title: "Accra Weekend Sample",
      centerLat: 5.6037,
      centerLng: -0.187,
      placeId: "ChIJ4Y7fA7n3wRQR5gVQxGmJ5h8",
      days: {
        create: [
          {
            dayIndex: 1,
            items: {
              create: [
                {
                  placeId: "sample-do-1",
                  name: "Kwame Nkrumah Memorial Park",
                  lat: 5.547,
                  lng: -0.203,
                  category: "do",
                  orderIndex: 0,
                  notes: "Landmark stop with rich history."
                },
                {
                  placeId: "sample-eat-1",
                  name: "Jamestown Coffee Spot",
                  lat: 5.538,
                  lng: -0.224,
                  category: "eat",
                  orderIndex: 1,
                  notes: "Easy coffee stop close to attractions."
                },
                {
                  placeId: "sample-eat-2",
                  name: "Buka Restaurant",
                  lat: 5.566,
                  lng: -0.178,
                  category: "eat",
                  orderIndex: 2,
                  notes: "Popular local dinner choice."
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`Seeded trip: ${trip.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
