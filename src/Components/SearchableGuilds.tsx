import { React, classNames, guilds, marginStyles } from "replugged/common";
import { Divider, SearchBar } from "replugged/components";
import type Types from "@Types";

import GuildSelector from "./Selector";
import "./SearchableGuilds.css";

export default (): React.ReactElement => {
  const [searchValue, setSearchValue] = React.useState<string>("");

  const isFiltered = React.useCallback(
    (guild: Types.Guild) => {
      if (!searchValue) return true;
      const words = searchValue.split(" ").map((w) => w.toLowerCase());
      return words.some(
        (w) =>
          guild?.name?.toLowerCase().includes(w) ||
          guild?.description?.toLowerCase().includes(w) ||
          guild?.id?.toLowerCase().includes(w),
      );
    },
    [searchValue],
  );

  const guildRecords = Object.values(guilds.getGuilds()).filter(isFiltered);

  return (
    <div className={classNames(marginStyles.marginTop20)}>
      <SearchBar
        autoFocus={true}
        placeholder="Search Guilds"
        query={searchValue}
        onChange={setSearchValue}
        onClear={() => setSearchValue("")}
      />
      <Divider />
      <div
        key={guildRecords.length ? "selectorContainer" : "noResultContainer"}
        className={classNames(marginStyles.marginBottom20, marginStyles.marginTop20, {
          "shc-noResultContainer": !guildRecords.length,
          "shc-selectorContainer": guildRecords.length,
        })}>
        {guildRecords.map((guild) => (
          <GuildSelector id={guild.id} path="blacklistedGuilds" guild={guild} key={guild.id} />
        ))}
      </div>
    </div>
  );
};
