<script lang="ts">
    import type {CityT, PopoLinkT, PopoT} from 'src/types';
    import {derived, type Readable} from 'svelte/store';
    import {location} from '../../../state';
    import {distanceBetweenCoordinates} from '../../../utils'

    export let popo: PopoT;
    export let city: CityT;

    const travelMode: "driving" | "walking" | "bicycling" | "transit" = "transit"

    let imageUrl = `https://picsum.photos/seed/${popo.name}/600/450`;
    if (popo.imageName) imageUrl = `/images/${city.slug}/${popo.imageName}`;

    const distance: Readable<number | null> = derived(location, $location => {
        if (!$location)
            return null

        return distanceBetweenCoordinates(
            [$location[0], $location[1]],
            [popo.mapCoordinates[0], popo.mapCoordinates[1]]
        )
    }, null);

    const links: Readable<PopoLinkT[]> = derived(location, $location => {
        let mapsMarkerUrl = `https://www.google.com/maps?q=${popo.name}`;
        let mapsDirectionUrl = null;

        if (city) {
            mapsMarkerUrl += `, ${city.address}`;
        }
        if ($location) {
            mapsDirectionUrl = `https://www.google.com/maps/dir/?api=1&travelmode=${travelMode}&origin=${$location[0]},${$location[1]}&destination=${popo.mapCoordinates[0]},${popo.mapCoordinates[1]}`
        }

        return [
            {name: "Maps", url: mapsMarkerUrl},
            {name: "Walk", url: mapsDirectionUrl},
        ]
    }, [])
</script>
{#if popo}
    <div class="relative bg-white group rounded-md shadow-sm hover:shadow-xl duration-200">
        <div class="absolute top-0 left-0 w-full h-full bb -z-10"></div>
        <div class="flex flex-col justify-between h-full">
            <div class="relative">
                <img
                        class="object-cover w-full h-48 rounded-t-md group-hover:scale-95 duration-150 group-hover:rounded-md"
                        alt=""
                        src={imageUrl}
                />
                {#if $distance}
                    <p class="absolute top-0 right-0 px-2 py-1 bg-white rounded pointer-events-none">{$distance} Kms</p>
                {/if}
                <div class="px-4 py-4">
                    <p class="mb-2 font-semibold text-center">{popo.name}</p>
                    <p>{popo.description}</p>
                </div>
            </div>
            <div class="flex flex-col p-2 m-2 rounded shadow-sm justify-self-end"
                 style="background-color: var(--color-primary);"
            >
                <p>Hours: {popo.openingHours}</p>
                <div class="flex justify-end mt-3 gap-4">
                    {#each $links as {url, name}}
                        {#if url}
                            <a
                                    target="_blank"
                                    class="self-end px-4 py-1 rounded shadow hover:shadow-xl"
                                    style="background-color: var(--color-secondary);"
                                    href={url}>{name}</a
                            >
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>
{:else}
    <p>Popo not found</p>
{/if}