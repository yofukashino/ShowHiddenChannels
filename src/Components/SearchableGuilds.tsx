import { common } from "replugged";
import { SettingValues } from "../index";
import { DiscordComponents, GuildStore, IconUtils } from "../lib/requiredModules";
import IconSwitch from "./IconSwitch";
import * as Utils from "../lib/utils";
import * as Types from "../types";
const { React } = common;
const {
  PopoutList: { SearchBar, Divider },
} = DiscordComponents;
export default () => {
  const [searchValue, setSearchValue] = React.useState("");
  const filteredGuildsWithState = Object.values(GuildStore.getGuilds())
    .map((Guild: Types.Guild) => ({
      Guild,
      ...(Utils.useSetting(
        SettingValues,
        `blacklistedGuilds.${Guild.id}`,
        false as unknown as string,
      ) as unknown as {
        value: boolean;
        onChange: (newValue: boolean) => void;
      }),
    }))
    .filter(({ Guild }: { Guild: Types.Guild }) =>
      searchValue
        ? Guild?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          Guild?.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
          Guild?.id?.includes(searchValue)
        : true,
    )
    .sort((a, b) => a.Guild.name.localeCompare(b.Guild.name));

  return (
    <div
      {...{
        className: `shc-guild-search`,
      }}>
      <SearchBar
        {...{
          autoFocus: true,
          placeholder: "Search Guilds",
          query: searchValue || "",
          onChange: (query) => setSearchValue(query),
          onClear: () => setSearchValue(""),
        }}
      />
      <Divider />
      {...filteredGuildsWithState.map(({ Guild, ...state }) => (
        <IconSwitch
          {...{
            title: Guild.name,
            note: Guild.description,
            icon:
              IconUtils.getGuildIconURL(Guild) ??
              IconUtils.getDefaultAvatarURL(Utils.randomNo(0, 69)),
            ...state,
          }}
        />
      ))}
    </div>
  );
};
