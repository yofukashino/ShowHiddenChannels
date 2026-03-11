import { Flex, Text } from "replugged/components";

import "./NothingButWaumpus.css";

export default (): React.ReactElement => (
  <Flex direction={Flex.Direction.VERTICAL} className="shc-detailFlex shc-nothing-but-waumpus">
    <img src="/assets/532f1d4582d881960783.svg" className="shc-nothing-but-waumpus-img" />
    <Text color="text-subtle" variant="text-xs/normal">
      Nothing But wumpus Here
    </Text>
  </Flex>
);
