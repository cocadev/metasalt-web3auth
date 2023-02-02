import { useRouter } from 'next/router';
import React, { memo } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';


const TermsOfService = () => {

  const router = useRouter();

  const onClose = () => {
    router.push('/', undefined, { shallow: true })
  }

  return (
    <LayoutPage>
      <LayoutScreen title='Terms of Service' description='Metasalt'>
        <section className='container'>
          <div className="spacer-single" />
          <div className="color-b" style={{ fontSize: 18 }}>
            1. Introduction. METASALT is an NFT minting platform with a full-featured marketplace, a mobile app for Point-of-Sale (PoS) retail minting, and a built-in security mechanism. Authenciation is paid for using $METASALT utility tokens which can be purchased on Uniswap or earned by minting NFTs on METASALT. The system is deployed on Ethereum, Binance, and Polygon. Metasalt is owned and operated by SALT HOLDINGS, Inc. d/b/a Metasalt (“Metasalt,” “we,” “us”, or “our”). These Terms of Service (“Terms”) govern your access to and use of the Metasalt website(s), our APIs, mobile app (the “App”), and any other software, tools, features, or functionalities provided on or in connection with our services; including without limitation using our services to view, explore, and create NFTs and use our tools, at your own discretion and risk, to connect directly with others to purchase, sell, or transfer NFTs on public blockchains (collectively, the “Service”). “NFT” in these Terms means a non-fungible token or similar digital item implemented on a blockchain, which uses smart contracts to link to or otherwise be associated with certain content or data.<br /><br />

            2. Modification of this Agreement. We reserve the right, in our sole discretion, to modify this Agreement.
            All modifications become effective when they are posted, and we will notify you by updating the date at the top of the Agreement.
            <br /><br />

            3. Assumption of Risk By accessing METASALT’s software, you accept and acknowledge:
            The prices of blockchain assets are extremely volatile and we cannot guarantee purchasers will not lose money.
            Assets available to trade on METASALT should not be viewed as investments: their prices are determined by the market and fluctuate considerably.
            You are solely responsible for determining any taxes that apply to your transactions.
            METASALT’s services are non-custodial, such that we do not at any time have custody of the NFTs owned by our users.
            We do not store, send, or receive Digital Assets, as they respectively exist on the blockchain.
            As such, and due to the decentralized nature of the services provided, you are fully responsible for protecting your wallets and assets from any and all potential risks.
            Our software indexes NFTs on the Ethereum blockchain as they are created, and we are not responsible for any assets that users may mistakenly or willingly access or purchase through the software.
            You accept responsibility for any risks associated with purchasing such user-generated content, including (but not limited to) the risk of purchasing counterfeit assets, mislabeled assets, assets that are vulnerable to metadata decay, assets on faulty smart contracts, and assets that may become untransferable.<br /><br />

            4. Disclaimers. We do not represent or warrant that access to the front-end interface will be continuous, uninterrupted, timely, or secure; that the information contained in the interface will be accurate, reliable, complete, or current; or that the Interface will be free from errors, defects, viruses, or other harmful elements.<br /><br />

            5. Proprietary Rights. We own the intellectual property generated by core contributors to METASALT for the use of METASALT, including (but not limited to) software, text, designs, images, and copyrights.
            Unless otherwise stated, METASALT reserves exclusive rights to its intellectual property.
            Refer to our Brand Assets Documentation for guidance on the use of METASALT’s intellecutal property covering patents, trademarks, and copyrights. <br /><br />

            6. Eligibility. To access or use the front-end interface, you represent that you are at least the age of majority in your jurisdiction.
            You further represent that your access and use of the front-end interface will fully comply with all applicable laws and regulations and that you will not access or use the front-end interface to conduct, promote, or otherwise facilitate any illegal activity.
            Furthermore, you represent that neither you nor any entity you represent are included in any trade embargoes or sanctions list (“Subject to Restrictions”), nor resident, citizen, national or agent of, or an entity organized, incorporated or doing business in such territories (“Restricted Territories”).<br /><br />

            7. Privacy. When you use the front-end interface, the only information we collect from you is your blockchain wallet address, completed transaction hashes, and token identifiers.
            We do not collect any personal information from you.
            We do, however, use third-party services like Google Analytics, which may receive your publicly available personal information.
            We do not take responsibility for any information you make public on the Ethereum blockchain by taking actions through the front-end interface.<br /><br />

            8. Prohibited Activity. You agree not to engage in any of the following categories of prohibited activity in relation to your access and use of the front-end interface: Intellectual property infringement, such as violations to copyright, trademark, service mark or patent.
            Interaction with assets, listings, smart contracts, and collections that include metadata that may be deemed harmful or illegal, including (but not limited to):
            metadata that promotes suicide or self-harm, incites hate or violence against others, degrades or doxxes another individual, depicts minors in sexually suggestive situations, or raises funds for terrorist organizations.
            Transacting in any Restricted Territory or interacting with any blockchain addresses controlled indirectly or directly by persons or entities Subject to Restrictions, that is, included in any trade embargoes or sanctions list.<br /><br />

            9. Limitation of Liability. METASALT is in no way liable for any damages of any form resulting from your access or use of METASALT software, including (but not limited to) any loss of profit, digital assets, or intangible property, and assumes no liability or responsibility for any errors, omissions, mistakes, or inaccuracies in the content provided on METASALT-controlled software or media; unauthorized access or use of any server or database controlled by METASALT; bugs, viruses etc.
            in the software; suspension of service; or any conduct of any third party whatsoever.
            Furthermore, any hyperlink or reference to a third party website, product, or person that is shared or published in any software or other channel by METASALT is for your convenience only, and does not constitute an endorsement. <br /><br />
            We accept no legal responsibility for content or information of such third party sites.

          </div>

          <div className="row justify-center mt-5" >

            <div className="offer-btn" onClick={onClose} style={{ width: 200, marginRight: 20 }}>
              I disagree
            </div>

            <div
              className={'offer-btn buy-btn'}
              onClick={onClose}
              style={{ width: 200 }}
            >
              I agree
            </div>
          </div>
        </section>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default memo(TermsOfService);