// import { BigInt, Bytes, ipfs, json, JSONValue } from "@graphprotocol/graph-ts";
// import { log } from "@graphprotocol/graph-ts";

import { TargetTagged,  ETS} from "../generated/ETS/ETS";
import { ETSTag } from "../generated/ETSTag/ETSTag";
import { Tag, Tagging_Record } from "../generated/schema";

import {
  toLowerCase,
  safeLoadPublisher,
  safeLoadPlatform,
  safeLoadOwner,
  safeLoadTagger,
  safeLoadCreator,
  ONE,
} from "../utils/helpers";

/*
 * Track the tagging of an NFT asset
 *
 * event.params.tagId NFT ID of the tag
 * event.params.nftContract Contract address of the NFT asset being tagged
 * event.params.nftId NFT ID of the NFT asset being tagged
 * event.params.tagger Ethereum address that initiated the tag
 * event.params.publisher Publisher that facilitated the tag
 * event.params.tagFee Fee earned by the tag Protocol
 * event.params.nftChainId Chain Id the target nft is on
 *
 * Notes
 *    A number of data points are generated off the back of this tagging event:
 *     - Tag / usage count for a tag
 *     - Tagging fees earned by the tag owner, publisher and platform
 */
export function handleTagRegistered(event: TargetTagged): void {
  let registryContract = ETS.bind(event.address);
  let tagFee = registryContract.taggingFee();

  let modulo = registryContract.modulo();
  let platformPercentageOfTagFee = registryContract.platformPercentage();
  let publisherPercentageOfTagFee = registryContract.publisherPercentage();
  let remainingPercentage = modulo.minus(platformPercentageOfTagFee).minus(publisherPercentageOfTagFee);

  let protocolAddress = registryContract.etsTag();
  let protocolContract = ETSTag.bind(protocolAddress);
  let platformAddress = protocolContract.platform();

  let etsTagId = registryContract.getTaggingRecord(event.params.taggingId).value0;
  let owner = protocolContract.ownerOf(etsTagId);

  let publisherFee = tagFee.times(publisherPercentageOfTagFee).div(modulo);
  let platformFee = tagFee.times(platformPercentageOfTagFee).div(modulo);
  let remainingFee = tagFee.times(remainingPercentage).div(modulo);

  let etsTag = Tag.load(etsTagId.toString());

  // this is a pre-auction state if true or post-auction if false
  if (owner.equals(platformAddress)) {
    if (etsTag) {
      etsTag.creatorRevenue = etsTag.creatorRevenue.plus(remainingFee);

      //  Update creator counts and fees
      let creator = protocolContract.getCreatorAddress(etsTagId);
      let creatorEntity = safeLoadCreator(creator.toHexString());

      if (creatorEntity) {
        creatorEntity.tagCount = creatorEntity.tagCount.plus(ONE);
        creatorEntity.tagFees = creatorEntity.tagFees.plus(remainingFee);
        creatorEntity.save();
      }
    }
  } else {
    if (etsTag) {
      etsTag.ownerRevenue = etsTag.ownerRevenue.plus(remainingFee);

      // Update owner counts and fees
      let ownerEntity = safeLoadOwner(owner.toHexString());

      if (ownerEntity) {
        ownerEntity.tagCount = ownerEntity.tagCount.plus(ONE);
        ownerEntity.tagFees = ownerEntity.tagFees.plus(remainingFee);
        ownerEntity.save();
      }
    }
  }

  // Update rest of tag data
  if (etsTag) {
    etsTag.tagCount = etsTag.tagCount.plus(ONE);
    etsTag.publisherRevenue = etsTag.publisherRevenue.plus(publisherFee);
    etsTag.protocolRevenue = etsTag.protocolRevenue.plus(platformFee);
    etsTag.save();
  }

  // Store tag information
  let taggingRecord = new Tagging_Record(event.params.taggingId.toString());

  if (taggingRecord && etsTag) {
    taggingRecord.tagId = etsTagId.toString();
    taggingRecord.nftContract = registryContract.getTaggingRecord(event.params.taggingId).value1;
    taggingRecord.nftId = registryContract.getTaggingRecord(event.params.taggingId).value2.toString();
    taggingRecord.nftChainId = registryContract.getTaggingRecord(event.params.taggingId).value6;
    taggingRecord.tagger = registryContract.getTaggingRecord(event.params.taggingId).value3;
    taggingRecord.timestamp = registryContract.getTaggingRecord(event.params.taggingId).value4;
    taggingRecord.publisher = registryContract.getTaggingRecord(event.params.taggingId).value5;
    taggingRecord.displayTag = etsTag.displayTag;
    let lowerTag = toLowerCase(etsTag.displayTag);
    taggingRecord.tag = lowerTag;
    taggingRecord.tagWithoutHash = lowerTag.substring(1, lowerTag.length);
    taggingRecord.save();
  }
  //let erc721Contract = HashtagProtocol.bind(event.params.nftContract);
  //tagEntity.nftContractName = erc721Contract.name();
  //let tokenUriCallResult = erc721Contract.try_tokenURI(event.params.nftId);
  //tagEntity.nftTokenUri = tokenUriCallResult.reverted ? null : tokenUriCallResult.value;/
  //if (!tokenUriCallResult.reverted) {
  //  let nftMetadata = extractNftIPFSMetadata(tagEntity.nftTokenUri);
  //  if (nftMetadata) {
  //    tagEntity.nftName = nftMetadata.nftName;
  //    tagEntity.nftDescription = nftMetadata.nftDescription;
  //    tagEntity.nftImage = nftMetadata.nftImage;
  //  }
  //}

  // update publisher counts and fees
  let publisherEntity = safeLoadPublisher(registryContract.getTaggingRecord(event.params.taggingId).value5.toString());

  if (publisherEntity) {
    publisherEntity.tagCount = publisherEntity.tagCount.plus(ONE);
    publisherEntity.tagFees = publisherEntity.tagFees.plus(publisherFee);
    publisherEntity.save();
  }

  // update platform fees
  let platform = safeLoadPlatform("platform");

  if (platform) {
    platform.tagFees = platform.tagFees.plus(platformFee);
    platform.save();
  }

  // update tagger counts
  let tagger = safeLoadTagger(registryContract.getTaggingRecord(event.params.taggingId).value3.toString());

  if (tagger) {
    tagger.tagCount = tagger.tagCount.plus(ONE);
    tagger.feesPaid = tagger.feesPaid.plus(tagFee);
    tagger.save();
  }
}
