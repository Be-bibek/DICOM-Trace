// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DICOMTrustLedger
 * @notice Security-oriented DICOM integrity and provenance smart contract ledger.
 * @dev Stores ONLY cryptographic commitments (cipherHash, watermarkProof, expiration) and governance metadata.
 * ABSOLUTELY NO Patient Health Information (PHI), raw images, or secret keys are stored on-chain.
 */
contract DICOMTrustLedger {
    address public contractOwner;

    struct DICOMRecord {
        address owner;
        uint256 registrationTime;
        uint256 expirationTime;
        bytes32 watermarkProof;
        bool revoked;
        string revocationReason;
    }

    // Mapping from cipherHash (SHA-256 of encrypted DICOM payload) to DICOMRecord
    mapping(bytes32 => DICOMRecord) public records;

    event DICOMRegistered(
        bytes32 indexed cipherHash,
        bytes32 watermarkProof,
        address indexed owner,
        uint256 expirationTime
    );

    event AccessVerified(
        bytes32 indexed cipherHash,
        bool success,
        address indexed verifier
    );

    event BreachReported(
        bytes32 indexed cipherHash,
        string reason,
        address indexed reporter
    );

    error Unauthorized();
    error AlreadyRegistered();
    error RecordNotFound();
    error RecordExpired();
    error RecordRevoked();
    error InvalidProof();

    modifier onlyOwner() {
        if (msg.sender != contractOwner) revert Unauthorized();
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    /**
     * @notice Register a new encrypted DICOM commitment
     * @param cipherHash SHA-256 hash of the AES-256-GCM ciphertext
     * @param watermarkProof SHA-256 hash of the extracted LSB fragile watermark
     * @param ttlSeconds Time-to-live window in seconds (0 = no expiration)
     */
    function registerDICOM(
        bytes32 cipherHash,
        bytes32 watermarkProof,
        uint256 ttlSeconds
    ) external {
        if (records[cipherHash].registrationTime != 0) revert AlreadyRegistered();

        uint256 expTime = ttlSeconds > 0 ? block.timestamp + ttlSeconds : 0;

        records[cipherHash] = DICOMRecord({
            owner: msg.sender,
            registrationTime: block.timestamp,
            expirationTime: expTime,
            watermarkProof: watermarkProof,
            revoked: false,
            revocationReason: ""
        });

        emit DICOMRegistered(cipherHash, watermarkProof, msg.sender, expTime);
    }

    /**
     * @notice Verify access for a presented cipherHash and watermark proof
     * @param cipherHash SHA-256 hash of the payload
     * @param presentedProof Watermark proof extracted from pixel array
     */
    function verifyAccess(
        bytes32 cipherHash,
        bytes32 presentedProof
    ) external returns (bool) {
        DICOMRecord storage rec = records[cipherHash];
        if (rec.registrationTime == 0) revert RecordNotFound();
        if (rec.revoked) revert RecordRevoked();
        if (rec.expirationTime > 0 && block.timestamp > rec.expirationTime) revert RecordExpired();

        bool success = (rec.watermarkProof == presentedProof);
        emit AccessVerified(cipherHash, success, msg.sender);
        
        if (!success) {
            revert InvalidProof();
        }

        return true;
    }

    /**
     * @notice Report a security breach or tamper event and revoke the DICOM registration
     * @param cipherHash SHA-256 hash of the compromised payload
     * @param reason Explanation of breach or revocation
     */
    function reportBreachAndRevoke(
        bytes32 cipherHash,
        string calldata reason
    ) external {
        DICOMRecord storage rec = records[cipherHash];
        if (rec.registrationTime == 0) revert RecordNotFound();
        if (msg.sender != rec.owner && msg.sender != contractOwner) revert Unauthorized();

        rec.revoked = true;
        rec.revocationReason = reason;

        emit BreachReported(cipherHash, reason, msg.sender);
    }

    /**
     * @notice Fetch registration record for a given cipherHash
     */
    function getRegistration(bytes32 cipherHash) external view returns (
        address owner,
        uint256 registrationTime,
        uint256 expirationTime,
        bytes32 watermarkProof,
        bool revoked,
        string memory revocationReason
    ) {
        DICOMRecord storage rec = records[cipherHash];
        if (rec.registrationTime == 0) revert RecordNotFound();
        return (
            rec.owner,
            rec.registrationTime,
            rec.expirationTime,
            rec.watermarkProof,
            rec.revoked,
            rec.revocationReason
        );
    }
}
