import { places } from "./places";
import { organizations } from "./organizations";


export function getPlaceById(id: string) {

  return places.find(

    (place) => place.id === id

  );

}



export function getOrganizationById(id: string) {

  return organizations.find(

    (organization) => organization.id === id

  );

}



export function getAllExperiences() {

  return places.flatMap(

    (place) =>

      place.experiences.map(

        (experience) => ({

          ...experience,

          place,

          placeId: place.id,

          video:

            experience.media?.find(

              (item) => item.type === "video"

            )?.url ?? "",

        })

      )

  );

}