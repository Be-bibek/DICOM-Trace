const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DICOMTrustLedger Smart Contract", function () {
  let ledger;
  let owner;
  let addr1;
  let addr2;

  const sampleCipherHash = ethers.keccak256(ethers.toUtf8Bytes("EncryptedDICOMCiphertext1"));
  const sampleWatermarkProof = ethers.keccak256(ethers.toUtf8Bytes("FragileWatermarkProof1"));

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const DICOMTrustLedger = await ethers.getContractFactory("DICOMTrustLedger");
    ledger = await DICOMTrustLedger.deploy();
  });

  it("Should register a DICOM commitment successfully", async function () {
    await expect(ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600))
      .to.emit(ledger, "DICOMRegistered");

    const rec = await ledger.getRegistration(sampleCipherHash);
    expect(rec.owner).to.equal(addr1.address);
    expect(rec.watermarkProof).to.equal(sampleWatermarkProof);
    expect(rec.revoked).to.be.false;
  });

  it("Should reject duplicate registration", async function () {
    await ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600);
    await expect(
      ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600)
    ).to.be.revertedWithCustomError(ledger, "AlreadyRegistered");
  });

  it("Should verify access with valid proof", async function () {
    await ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600);
    
    await expect(ledger.connect(addr2).verifyAccess(sampleCipherHash, sampleWatermarkProof))
      .to.emit(ledger, "AccessVerified")
      .withArgs(sampleCipherHash, true, addr2.address);
  });

  it("Should reject access with invalid proof", async function () {
    await ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600);
    const badProof = ethers.keccak256(ethers.toUtf8Bytes("BadWatermarkProof"));
    
    await expect(
      ledger.connect(addr2).verifyAccess(sampleCipherHash, badProof)
    ).to.be.revertedWithCustomError(ledger, "InvalidProof");
  });

  it("Should allow authorized owner or contract owner to report breach and revoke", async function () {
    await ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600);

    await expect(ledger.connect(addr1).reportBreachAndRevoke(sampleCipherHash, "Tampered pixel LSB"))
      .to.emit(ledger, "BreachReported")
      .withArgs(sampleCipherHash, "Tampered pixel LSB", addr1.address);

    const rec = await ledger.getRegistration(sampleCipherHash);
    expect(rec.revoked).to.be.true;

    // Access after revocation must fail
    await expect(
      ledger.connect(addr2).verifyAccess(sampleCipherHash, sampleWatermarkProof)
    ).to.be.revertedWithCustomError(ledger, "RecordRevoked");
  });

  it("Should reject unauthorized revocation attempt", async function () {
    await ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 3600);

    await expect(
      ledger.connect(addr2).reportBreachAndRevoke(sampleCipherHash, "Malicious revocation attempt")
    ).to.be.revertedWithCustomError(ledger, "Unauthorized");
  });

  it("Should reject access to expired registration", async function () {
    // 10 second TTL
    await ledger.connect(addr1).registerDICOM(sampleCipherHash, sampleWatermarkProof, 10);
    
    // Fast-forward EVM time by 15 seconds
    await ethers.provider.send("evm_increaseTime", [15]);
    await ethers.provider.send("evm_mine");

    await expect(
      ledger.connect(addr2).verifyAccess(sampleCipherHash, sampleWatermarkProof)
    ).to.be.revertedWithCustomError(ledger, "RecordExpired");
  });
});
