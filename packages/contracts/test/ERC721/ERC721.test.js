const { artifacts } = require("hardhat");

const { shouldBehaveLikeERC721, shouldBehaveLikeERC721Metadata } = require("./behaviors/ERC721.behavior");
const { shouldBehaveLikeERC721Pausable } = require("./behaviors/ERC721Pausable.behavior");
const { shouldBehaveLikeERC721Burnable } = require("./behaviors/ERC721Burnable.behavior");
const ETSAccessControls = artifacts.require("ETSAccessControls");
const ETSTag = artifacts.require("ETSTag");

contract("ERC721", function (accounts) {
  const [ETSAdmin, ETSPublisher] = accounts;

  beforeEach(async function () {
    this.accessControls = await ETSAccessControls.new({ from: ETSAdmin });
    await this.accessControls.initialize();
    await this.accessControls.grantRole(await this.accessControls.SMART_CONTRACT_ROLE(), ETSAdmin, {
      from: ETSAdmin,
    });

    // add a publisher to the protocol
    await this.accessControls.grantRole(ethers.utils.id("PUBLISHER"), ETSPublisher);

    this.token = await ETSTag.new();
    await this.token.initialize(this.accessControls.address, ETSAdmin);
  });

  const name = "Ethereum Tag Service";
  const symbol = "ETSTAG";

  shouldBehaveLikeERC721("ERC721", ...accounts);
  shouldBehaveLikeERC721Pausable("ERC721", ...accounts);
  shouldBehaveLikeERC721Burnable("ERC721", ...accounts);
  shouldBehaveLikeERC721Metadata("ERC721", name, symbol, ...accounts);
});
