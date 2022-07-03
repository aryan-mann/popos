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
    <div class="group relative bg-white rounded-md shadow-sm hover:shadow-xl duration-200">
        <div class="bb absolute w-full h-full left-0 top-0 -z-10"></div>
        <div class="flex flex-col h-full justify-between">
            <div class="relative">
                <img
                        class="h-48 object-cover rounded-t-md w-full group-hover:scale-95 duration-150 group-hover:rounded-md"
                        alt=""
                        src={imageUrl}
                />
                {#if $distance}
                    <p class="absolute rounded top-0 right-0 pointer-events-none px-2 py-1 bg-white">{$distance} Kms</p>
                {/if}
                <div class="px-4 py-4">
                    <p class="text-center mb-2 font-semibold">{popo.name}</p>
                    <p>{popo.description}</p>
                </div>
            </div>
            <div class="m-2 flex flex-col rounded shadow-sm justify-self-end p-2"
                 style="background-color: var(--color-primary);"
            >
                <p>Hours: {popo.openingHours}</p>
                <div class="flex gap-4 justify-end mt-3">
                    {#each $links as {url, name}}
                        {#if url}
                            <a
                                    target="_blank"
                                    class="self-end px-4 py-1 shadow hover:shadow-xl rounded"
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