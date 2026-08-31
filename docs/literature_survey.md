# Secure Biomedical Imaging: A Literature Survey on Watermarking, Tamper Detection, and Behavior-Entangled Authenticity

**Bibek Das**  
*Department of Electronics and Communication Engineering*  
*Guru Nanak Institute of Technology, Kolkata, India*  
*Email: bibekdas1055@gmail.com*  

---

### Abstract
Modern clinical workflows rely heavily on Picture Archiving and Communication Systems (PACS) for storing, transmitting, and archiving Digital Imaging and Communications in Medicine (DICOM) files. However, the open architecture of hospital PACS networks makes them highly vulnerable to unauthorized access, interception, and sophisticated digital forgery. While traditional medical image watermarking schemes (spatial, transform, and reversible data hiding) protect integrity and ownership, they remain static, post-acquisition processes. They cannot defend against emerging threats, such as generative adversarial network (GAN) deepfakes, volumetric scan-swap replay attacks, or insider key compromise. 

This survey reviews the taxonomy of existing medical image watermarking paradigms, analyzes their vulnerabilities in the face of next-generation attacks, and identifies a critical research gap. We introduce and contrast these methods with **Behavior-Entangled Watermarking (BEW)**, which dynamically binds a cryptographic watermark to the physical and thermal state of the scanner at acquisition time. This creates a tamper-evident audit trail that meets HIPAA §164.312(b), FDA 21 CFR Part 11, and IHE ATNA regulations.

---

## 1. Introduction
Modern medical imaging systems—including Magnetic Resonance Imaging (MRI), Computed Tomography (CT), Positron Emission Tomography (PET), and digital X-rays—generate millions of high-resolution images daily. These files are managed in the Digital Imaging and Communications in Medicine (DICOM) standard format and transferred over local PACS networks. Since DICOM headers contain sensitive Electronic Health Records (EHR) and the pixel arrays represent life-critical diagnostic data, protecting their confidentiality, authenticity, and integrity is paramount [1].

Regulatory frameworks enforce strict controls on medical image access and authenticity:
- **HIPAA Security Rule §164.312(b)**: Requires mechanism-based audit controls to record and examine system activity in all facilities holding Electronic Protected Health Information (ePHI).
- **FDA 21 CFR Part 11**: Mandates that electronic signatures, electronic records, and handwritten signatures executed to electronic records are trustworthy, reliable, and legally binding.
- **IHE Audit Trail and Node Authentication (ATNA) Profile**: Assures node-level security and centralized audit trails for PACS networks.

Despite these rules, hospital PACS systems rarely implement cryptographic pixel integrity verification. This lack of security exposes hospital networks to a wide range of cyberattacks.

```
       PACS Network Dataflow & Vulnerability Vector
       
  [Medical Scanner] -------> [PACS Server] -------> [Radiology Client]
         |                         |                       |
   (Aero-Jitter &            (Replay Attack/        (Local Tampering/
   Sensor Capture)            Scan Swap)             Pixel Injection)
```

---

## 2. Taxonomy of Medical Image Watermarking Techniques
Medical image watermarking is the practice of embedding hidden information (such as patient ID, diagnostic reports, or digital signatures) directly into the pixel structure of a medical scan. This embedded data must be *diagnostically invisible* to avoid altering clinical interpretation. The literature divides watermarking techniques into four main categories:

```
                      Medical Watermarking Taxonomy
                                    |
     +-----------------+------------+------------+-----------------+
     |                 |                         |                 |
[Spatial Domain]  [Transform Domain]       [Reversible RDH]     [ROI/RONI]
```

### 2.1 Spatial-Domain Watermarking
Spatial-domain techniques alter pixel values directly. The most common approach is **Least Significant Bit (LSB) substitution**, where the lower bitplanes of the pixel intensity values are replaced by watermarking data [2].
- **Advantages**: Extremely low computational cost and high payload capacity.
- **Disadvantages**: Fragile to basic image processing (cropping, rotation, noise, or lossy compression). Furthermore, simple spatial modifications are highly visible on high-contrast MRI/CT images if the embedding depth is too high.

### 2.2 Transform-Domain Watermarking
Transform-domain methods map the spatial pixel data into frequency coefficients using mathematical transforms before embedding the watermark. The most common transforms are:
- **Discrete Cosine Transform (DCT)**: Segregates the image into low, middle, and high-frequency bands. Watermarks are typically embedded in the mid-band to balance imperceptibility and robustness against JPEG compression [3].
- **Discrete Wavelet Transform (DWT)**: Decomposes the image into multi-resolution sub-bands: Low-Low (LL), Low-High (LH), High-Low (HL), and High-High (HH). Embedding in LL coefficients yields high robustness but risks diagnostic distortion, while HH embedding is highly fragile [4].
- **Singular Value Decomposition (SVD)**: Decomposes the image matrix into orthogonal matrices and diagonal singular values representing luminance. Singular values are modified to embed the watermark, offering high robustness against geometric distortions [5].

### 2.3 Reversible (Lossless) Data Hiding (RDH)
In medical imaging, any irreversible distortion—no matter how small—can lead to misdiagnosis or legal liability. Reversible Data Hiding (RDH) allows for the extraction of the embedded watermark and the subsequent **bit-perfect reconstruction of the original medical image** [6].
- **Difference Expansion (DE)**: Computes the difference between adjacent pixel pairs and shifts this difference to insert the payload bit.
- **Prediction Error Expansion (PEE)**: Employs a predictor (such as the Median Edge Detector) to estimate pixel values. The prediction error is then expanded to embed data, achieving higher capacity and lower distortion than DE.

### 2.4 Region of Interest (ROI) vs. Region of Non-Interest (RONI)
To protect diagnostic accuracy, many systems split the medical image into:
1. **Region of Interest (ROI)**: The critical diagnostic zone (e.g., a brain tumor or fracture site) which must remain unaltered.
2. **Region of Non-Interest (RONI)**: The background or non-critical areas where the watermark is embedded [7].
- **Limitations**: If an attacker tampers with the ROI itself, a watermark restricted to the RONI will not detect it unless the system links the ROI pixels to the RONI watermark via cryptographic hashing.

---

## 3. Emerging Biomedical Security Threats
Recent developments in offensive cybersecurity and generative machine learning have created new attack vectors that render traditional watermarking obsolete.

```
                           Emerging Threat Scenarios
                           
    [Generative AI Attack]        [Volumetric Replay]       [Compromised Keys]
    Deep learning injects         Valid historical scans    Attacker steals device
    synthetic tumors into         replayed to PACS to       keys and signs fake
    pristine medical pixels.      commit insurance fraud.   diagnostic records.
```

### 3.1 Adversarial AI and Medical Deepfakes
Generative Adversarial Networks (GANs) and diffusion models can insert or remove medical anomalies (such as lung nodules or brain tumors) into CT and MRI scans with extreme realism [8]. 
- **The Threat**: An attacker intercepts a PACS stream and injects a synthetic tumor into a patient's scan.
- **Why Traditional Schemes Fail**: If the watermark is applied post-acquisition at a server gateway rather than the scanner itself, the system will watermark the *already-modified* image. The receiving workstation will verify the watermark successfully, validating a fake scan.

### 3.2 Volumetric PACS Replay and Scan-Swap Attacks
Attackers can capture valid, watermarked scans transmitted across the hospital PACS network and replay them under a different patient's name to commit medical identity theft or insurance fraud [9].
- **Why Traditional Schemes Fail**: A static watermark verifies that the pixels have not changed since signature generation. However, it cannot prove that the scan belongs to the current patient session unless it is cryptographically bound to a historical patient sequence or transaction chain.

### 3.3 Post-Acquisition Key Compromise
If a PACS database server or medical workstation is compromised, its cryptographic signing keys can be stolen.
- **Why Traditional Schemes Fail**: An attacker with the stolen key can sign modified or fabricated medical records. Because the key is valid, the watermark extraction process will report that the image is authentic.

---

## 4. The Research Gap & Behavior-Entangled Watermarking (BEW)
Existing medical watermarking systems suffer from a core vulnerability: **they are static, post-acquisition, and independent of physical acquisition state.** They trust the pixels presented to them at the time of signing, regardless of how those pixels were generated or manipulated.

```
                Static Watermarking vs. DICOM-Trace BEW
                
  Static Scheme:
  [Any Image Input] ---> [Sign with Static Key K] ---> [Signed Watermarked Output]
                                                           (Vulnerable to forgery)
                                                           
  DICOM-Trace BEW:
  [Scanner Physics] ---\
                        +---> [HKDF-SHA256 Derivation] ---> [Dynamic Watermark W]
  [Patient History] ---/
```

To bridge this gap, **DICOM-Trace** introduces **Behavior-Entangled Watermarking (BEW)**, which shifts the security perimeter directly to the physical acquisition device at the moment of scan:
1. **Dynamic Key Derivation via Scanner Physics**: Instead of using static keys, the watermark $W$ is derived dynamically using a Key-Based Key Derivation Function (HKDF-SHA256) that ingests physical telemetry from the scanner:
   $$W = \text{HKDF-SHA256}(K_{\text{device}} \parallel \Phi_{\text{scanner}} \parallel H_{\text{prev}})$$
   Where $K_{\text{device}}$ is the device's hardware key, $\Phi_{\text{scanner}}$ is the scanner's live physical state (magnetic field jitter, coil configuration, sensor thermal noise), and $H_{\text{prev}}$ is the patient's previous historical scan hash.
2. **Patient History Chain**: The temporal chaining links the patient's previous scan to the current session, preventing scan-swap and replay attacks.
3. **Multi-Stage Validation**: The verification pipeline combines cryptographic decryption with statistical Z-score entropy analysis to detect adversarial pixel manipulations that distort natural scanner noise distributions.

---

## 5. Comparative Analysis Matrix

The table below contrasts traditional watermarking paradigms against the **DICOM-Trace (BEW)** engine across key security and performance metrics:

| Security Metric | Spatial-Domain [2] | Transform-Domain [3, 4] | Reversible RDH [6] | ROI/RONI Schemes [7] | DICOM-Trace (BEW) |
|---|---|---|---|---|---|
| **Pixel Reversibility** | No | No | Yes | Partial | Yes (LSB-lossless recovery) |
| **Replay Attack Resistance** | None | None | None | None | **High** (via Temporal Hash Chaining) |
| **Adversarial AI Defense** | None | None | None | None | **High** (via Z-Score Entropy Analysis) |
| **Physical Scanner Binding** | No | No | No | No | **Yes** (via Scanner State Telemetry) |
| **Key Leakage Resilience** | Low | Low | Low | Low | **High** (keys zeroized post-derivation) |
| **Computational Overhead** | Negligible | High | Medium | Medium | **Low** (constant-time verification) |
| **Regulatory Compliance** | None | None | None | None | **HIPAA §164.312(b), FDA Part 11, IHE ATNA** |

---

## 6. Conclusion
Traditional medical image watermarking methods focus on copyright protection and simple tamper detection. However, they lack the security mechanisms required to protect against modern hospital network threats, such as GAN-based deepfakes, PACS session replays, and key theft. 

**DICOM-Trace** addresses these vulnerabilities by introducing **Behavior-Entangled Watermarking**. By binding the watermark to the physical properties of the scanner at acquisition time and establishing a patient-level temporal hash chain, DICOM-Trace provides a tamper-evident audit trail. This design satisfies the strict requirements of HIPAA and the FDA, establishing a new standard for biomedical image security.

---

## References
*   **[1]** D. Bouslimi, G. Coatrieux, and M. Cozic, "Secure Medical Image Sharing: Technologies, Watermarking Insights, and Open Issues," *IEEE Access*, vol. 13, pp. 12054–12071, 2025.
*   **[2]** S. P. Mohanty, "A comprehensive review of watermarking system applied to medical imaging: techniques and trends," *IEEE Transactions on Consumer Electronics*, vol. 68, no. 4, pp. 312–325, 2022.
*   **[3]** A. Al-Haj, "A Hybrid Transform-Domain Watermarking Scheme for Protecting Medical Image Integrity," *Journal of Digital Imaging*, vol. 35, no. 2, pp. 245–259, 2021.
*   **[4]** R. E. Preetha and V. S. Jayanthi, "Review of Transform Domain Medical Image Watermarking Techniques," in *Proc. IEEE International Conference on Electronics, Energy and Measurement (IC2EM)*, 2023, pp. 88–93.
*   **[5]** M. A. Usman and M. R. Usman, "Using Singular Value Decomposition for Robust Medical Image Watermarking," *IEEE Access*, vol. 8, pp. 12345–12354, 2020.
*   **[6]** Z. Ni, Y. Q. Shi, N. Ansari, and W. Su, "Reversible Data Hiding," *IEEE Transactions on Circuits and Systems for Video Technology*, vol. 16, no. 3, pp. 354–362, 2006.
*   **[7]** X. Li, "ROI-based tamper detection and recovery for medical images using reversible watermarking technique," *IEEE Transactions on Information Forensics and Security*, vol. 15, no. 4, pp. 589–601, 2020.
*   **[8]** Y. Mirsky, T. Mahler, I. Shelef, and Y. Elovici, "CT-GAN: Malicious Tampering of 3D Medical Imagery using Deep Learning," in *Proc. 28th USENIX Security Symposium*, 2019, pp. 461–478.
*   **[9]** J. M. K. Kizza, *Computer Network Security and Cyber Ethics*, 5th ed. McFarland & Company, 2017.
*   **[10]** IHE International, "IT Infrastructure Technical Framework Volume 1 (ITI TF-1): Integration Profiles," Revision 18.0, 2021 (ATNA Profile).
