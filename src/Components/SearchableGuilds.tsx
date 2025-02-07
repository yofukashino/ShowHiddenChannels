import { settings, webpack } from "replugged";
import { React, components } from "replugged/common";
import Modules from "../lib/requiredModules";
import IconSwitch from "./IconSwitch";
import Utils from "../lib/utils";
import Types from "../types";

export default <
  T extends Record<string, Types.Jsonifiable>,
  D extends keyof T,
  K extends Extract<keyof T, string>,
>({
  SettingManager,
  path,
}: {
  SettingManager: settings.SettingsManager<T, D>;
  path: `${K}.${string}` | K;
}) => {
  const { GuildStore, IconUtils } = Modules;
  const { SearchBar, Divider } = webpack.getExportsForProps<Types.PopoutList>(components, [
    "SearchBar",
    "Divider",
  ]);
  const [searchValue, setSearchValue] = React.useState([]);
  const filteredGuildsWithState = Object.values(GuildStore.getGuilds())
    .map((Guild: Types.Guild) => ({
      Guild,
      ...(Utils.useSetting(SettingManager, `${path}.${Guild.id}`, false as never) as {
        value: boolean;
        onChange: (e: boolean) => void;
      }),
    }))
    .filter(({ Guild }: { Guild: Types.Guild }) =>
      searchValue
        ? searchValue.every((value) => Guild?.name?.toLowerCase().includes(value.toLowerCase())) ||
          searchValue.every((value) =>
            Guild?.description?.toLowerCase().includes(value.toLowerCase()),
          ) ||
          (searchValue.some((value) => Guild?.name?.toLowerCase().includes(value.toLowerCase())) &&
            searchValue.some((value) =>
              Guild?.description?.toLowerCase().includes(value.toLowerCase()),
            )) ||
          searchValue.some((value) => Guild?.id?.includes(value))
        : true,
    )
    .sort((a, b) => a.Guild.name.localeCompare(b.Guild.name));

  return (
    <div className={`shc-guild-search`}>
      <SearchBar
        autoFocus={true}
        placeholder="Search Guilds"
        query={searchValue.join(" ") || ""}
        onChange={(query) => setSearchValue(query.split(" "))}
        onClear={() => setSearchValue([])}
      />
      <Divider />
      {filteredGuildsWithState.map(({ Guild, ...state }) => (
        <IconSwitch
          key={Guild.id} // Don't forget to add a unique key
          title={Guild.name}
          note={Guild.description}
          icon={IconUtils.getGuildIconURL(Guild) ?? Utils.getAcronym(Guild.name)}
          {...state}
        />
      ))}
    </div>
  );
};
