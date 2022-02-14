const { BN, constants, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { ZERO_ADDRESS } = constants;

const firstTokenId = new BN("1");
const mockData = "0x42";

function shouldBehaveLikeERC721Pausable(
  errorPrefix,
  owner,
  publisher,
  operator,
  approved,
  anotherApproved,
  other,
  newOwner,
  creator,
) {
  context("when token is paused", function () {
    beforeEach(async function () {
      await this.token.mint("#TokenizeEverything", publisher, creator);
      await this.token.pause();
    });

    it("reverts when trying to transferFrom", async function () {
      await expectRevert(
        this.token.transferFrom(owner, newOwner, firstTokenId, { from: owner }),
        "ERC721Pausable: token transfer while paused",
      );
    });

    it("reverts when trying to safeTransferFrom", async function () {
      await expectRevert(
        this.token.safeTransferFrom(owner, newOwner, firstTokenId, { from: owner }),
        "ERC721Pausable: token transfer while paused",
      );
    });

    it("reverts when trying to safeTransferFrom with data", async function () {
      await expectRevert(
        this.token.methods["safeTransferFrom(address,address,uint256,bytes)"](owner, newOwner, firstTokenId, mockData, {
          from: owner,
        }),
        "ERC721Pausable: token transfer while paused",
      );
    });

    it("reverts when trying to mint", async function () {
      await expectRevert(
        this.token.mint("#trustless", publisher, creator),
        "ERC721Pausable: token transfer while paused",
      );
    });

    it("reverts when trying to burn", async function () {
      await expectRevert(this.token.burn(firstTokenId), "ERC721Pausable: token transfer while paused");
    });

    it("transfers after unpause", async function () {
      await expectRevert(
        this.token.safeTransferFrom(owner, newOwner, firstTokenId, { from: owner }),
        "ERC721Pausable: token transfer while paused",
      );
      await this.token.unPause();
      await this.token.safeTransferFrom(owner, newOwner, firstTokenId, { from: owner }),
        expect(await this.token.ownerOf(firstTokenId)).to.be.equal(newOwner);
    });

    describe("getApproved", function () {
      it("returns approved address", async function () {
        const approvedAccount = await this.token.getApproved(firstTokenId);
        expect(approvedAccount).to.equal(ZERO_ADDRESS);
      });
    });

    describe("balanceOf", function () {
      it("returns the amount of tokens owned by the given address", async function () {
        const balance = await this.token.balanceOf(owner);
        expect(balance).to.be.bignumber.equal("1");
      });
    });

    describe("ownerOf", function () {
      it("returns the amount of tokens owned by the given address", async function () {
        const ownerOfToken = await this.token.ownerOf(firstTokenId);
        expect(ownerOfToken).to.equal(owner);
      });
    });

    describe("exists", function () {
      it("returns token existence", async function () {
        expect(await this.token.exists(firstTokenId)).to.equal(true);
      });
    });

    describe("isApprovedForAll", function () {
      it("returns the approval of the operator", async function () {
        expect(await this.token.isApprovedForAll(owner, operator)).to.equal(false);
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC721Pausable,
};
