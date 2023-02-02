import * as CONFIG from "../keys";
import { DiscordLottie, LinkcontentLottie, QrcontentLottie, VideoLottie, YoutubeLottie } from "../components/loading";
import { Network } from "alchemy-sdk";

class UtilService {

  static getERC20Address = (chain) => {
    switch (chain) {
      case '0x13881':
        return CONFIG.MUMBAI_ERC20_ADDRESS;
      case '0x89':
        return CONFIG.POLYGON_ERC20_ADDRESS;
      case '0x61':
        return CONFIG.BSCT_ERC20_ADDRESS;
      case '0x4':
        return CONFIG.RINKEYBY_ERC20_ADDRESS;
      case '0x3':
        return CONFIG.ROPSTEN_ERC20_ADDRESS;
      case '0x5':
        return CONFIG.GOERLI_ERC20_ADDRESS;
      case '0x1':
      default:
        return CONFIG.MAIN_ERC20_ADDRESS;
    }
  }

  static getMarketAddress = (chain) => {
    switch (chain) {
      case '0x13881':
        return CONFIG.MUMBAI_MARKETPLACE_ADDRESS;
      case '0x89':
        return CONFIG.POLYGON_MARKETPLACE_ADDRESS;
      case '0x61':
        return CONFIG.BSCT_MARKETPLACE_ADDRESS;
      case '0x4':
        return CONFIG.RINKEYBY_MARKETPLACE_ADDRESS;
      case '0x3':
        return CONFIG.ROPSTEN_MARKETPLACE_ADDRESS;
      case '0x5':
        return CONFIG.GOERLI_MARKETPLACE_ADDRESS;
      case '0x1':
      default:
        return CONFIG.MAIN_MARKETPLACE_ADDRESS;
    }
  }

  static getMintAddress = (chain) => {
    switch (chain) {
      case '0x13881':
        return CONFIG.MUMBAI_MINT721_ADDRESS;
      case '0x89':
        return CONFIG.POLYGON_MINT721_ADDRESS;
      case '0x61':
        return CONFIG.BSCT_MINT721_ADDRESS;
      case '0x4':
        return CONFIG.RINKEYBY_MINT721_ADDRESS;
      case '0x3':
        return CONFIG.ROPSTEN_MINT721_ADDRESS;
      case '0x5':
        return CONFIG.GOERLI_MINT721_ADDRESS;
      case '0x1':
      default:
        return CONFIG.MAIN_MINT721_ADDRESS;
    }
  }

  static getMint1155Address = (chain) => {
    switch (chain) {
      case '0x13881':
        return CONFIG.MUMBAI_MINT1155_ADDRESS;
      case '0x89':
        return CONFIG.POLYGON_MINT1155_ADDRESS;
      case '0x61':
        return CONFIG.BSCT_MINT1155_ADDRESS;
      case '0x4':
        return CONFIG.RINKEYBY_MINT1155_ADDRESS;
      case '0x3':
        return CONFIG.ROPSTEN_MINT1155_ADDRESS;
      case '0x5':
        return CONFIG.GOERLI_MINT1155_ADDRESS;
      case '0x1':
      default:
        return CONFIG.MAIN_MINT1155_ADDRESS;
    }
  }

  static getChain = (chain) => {
    switch (chain) {
      case '0x13881':
        return 'Mumbai';
      case '0x89':
        return 'Polygon';
      case '0x61':
        return 'Binance Smart Chain Testnet';
      case '0x4':
        return 'Rinkeby';
      case '0x3':
        return 'Ropsten';
      case '0x5':
        return 'Goerli';
      case '0x1':
      default:
        return 'eth';
    }
  }

  static getChain2 = (chain) => {
    switch (chain) {
      case '0x13881':
        return 'Polygon Mumbai network';
      case '0x89':
        return 'Polygon network';
      case '0x61':
        return 'Binance Smart Chain network';
      case '0x4':
        return 'Rinkeby network';
      case '0x3':
        return 'Ropsten network';
      case '0x5':
        return 'Goerli network';
      case '0x1':
      default:
        return 'Ethereum network';
    }
  }

  static getChain3 = (chain) => {
    switch (chain) {
      case '0x13881':
      case '0x89':
        return 'MATIC';
      case '0x61':
        return 'BSC';
      case '0x5':
      case '0x4':
      case '0x3':
      case '0x1':
      default:
        return 'ETH';
    }
  }

  static getChain4 = (chain) => {
    switch (chain) {
      case 'mumbai':
        return '0x13881';
      case 'polygon':
        return '0x89';
      case 'bsc':
        return '0x61';
      case 'goerli':
        return '0x5';
      case 'eth':
      default:
        return '0x1';
    }
  }

  static getChain5 = (chain) => {
    switch (chain) {
      case '0x13881':
        return 'mumbai';
      case '0x89':
        return 'polygon';
      case '0x5':
        return 'goerli';
      case '0x1':
      default:
        return 'eth';
    }
  }

  static getRoyaltyAddress = (chain) => {
    switch (chain) {
      case 'mumbai':
        return '0x0a01E11887f727D1b1Cd81251eeEE9BEE4262D07';
      case 'polygon':
        return '0x28EdFcF0Be7E86b07493466e7631a213bDe8eEF2';
      case 'goerli':
        return '0xe7c9Cb6D966f76f3B5142167088927Bf34966a1f';
      case 'eth':
      default:
        return '0x0385603ab55642cb4dd5de3ae9e306809991804f';
    }
  }

  static getPriceUnit = (chain) => {
    switch (chain) {
      case '0x13881':
        return 'MATIC';
      case '0x89':
        return 'MATIC';
      case '0x61':
        return 'BSC';
      case '0x4':
        return 'RIN';
      case '0x3':
        return 'ROP';
      case '0x5':
        return 'GOR';
      case '0x1':
      default:
        return 'ETH';
    }
  }

  static getScanAddress = (chain) => {
    switch (chain) {
      case '0x13881':
        return "https://mumbai.polygonscan.com/address/" + CONFIG.MUMBAI_MINT721_ADDRESS;
      case '0x89':
        return "https://polygonscan.com/address/" + CONFIG.POLYGON_MINT721_ADDRESS;
      case '0x61':
        return 'https://testnet.bscscan.com/address/' + CONFIG.BSCT_MINT721_ADDRESS;
      case '0x5':
        return 'https://goerli.etherscan.io/address/' + CONFIG.GOERLI_MINT721_ADDRESS;
      case '0x4':
        return 'https://rinkeby.etherscan.io/address/' + CONFIG.RINKEYBY_MINT721_ADDRESS;
      case '0x3':
        return 'https://ropsten.etherscan.io/address/' + CONFIG.ROPSTEN_MINT721_ADDRESS;
      case '0x1':
      default:
        return 'https://etherscan.io/address/' + CONFIG.MAIN_MINT721_ADDRESS;
    }
  }

  static checkHexa = (num) => {
    return Boolean(num?.match(/^0x[0-9a-f]+$/i))
  }

  static toHex = (bytes) => {
    return bytes.reduce(function (string, byte) {
      return string + ('00' + byte.toString(16)).substr(-2);
    }, '');
  }

  static getColorNotification = (type) => {
    switch (type) {
      case 'success':
        return '#1e79db';
      case 'error':
        return '#cf4129';
      case 'info':
        return '#f2994a';
      default:
        return '#1e79db';
    }
  }

  static requestText = (acceptedData) => {
    if (acceptedData?.confirmed) {
      return 'Request Confirmed!'
    }
    if (acceptedData?.rejected) {
      return 'Request Rejected!'
    }
    if (acceptedData) {
      return 'Request Sent!'
    }
    return 'Buy Request'
  }

  static truncate = (address) => {
    if (!address) {
      return '-'
    }
    return address?.substr(0, 6) + '...' + address?.substr(-4);
  }

  static getContentLottie = (content) => {
    switch (content) {
      case 'YouTube':
        return <YoutubeLottie small />;
      case 'Discord':
        return <DiscordLottie small />;
      case 'QR Code':
        return <QrcontentLottie />;
      case 'Link':
        return <LinkcontentLottie />;
      default:
        return <VideoLottie />;
    }
  }

  static validateGatedEdit = (title, description, addedContent) => {
    if (!title) {
      return 'Title can\'t be empty.'
    }
    if (!description) {
      return 'Description can\'t be empty.'
    }
    // if ((addedNFT.length === 0) && addedContent.length === 0) {
    //   return 'You must add at least one NFT and one content item'
    // }
    // if (addedNFT.length === 0) {
    //   return 'You must add at least one NFT'
    // }
    if (addedContent.length === 0) {
      return 'You must add at least one content item'
    }
    return 'Validation Error!'
  }

  static convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  static FormatNumberLength(num, length) {
    var r = '' + num;
    while (r.length < length) {
      r = '0' + r;
    }
    return r;
  }

  static getVideoDuration(file) {
    const url = URL.createObjectURL(file);

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.muted = true;
      const source = document.createElement('source');
      source.src = url; //--> blob URL
      video.preload = 'metadata';
      video.appendChild(source);
      video.onloadedmetadata = function () {
        resolve(video.duration)
      };
    });
  }

  static padWithZero(number) {
    const string = number.toString();
    if (number < 10) {
      return '0' + string;
    }
    return string;
  }

  static padWithZero2(number) {
    const string = number.toString();
    if (number < 10) {
      return '00' + string;
    }
    if (number < 100) {
      return '0' + string;
    }
    return string;
  }

  static GetTimeLabel = (time) => {
    const index = Math.floor(time);
    if (index === 0 || !index) return '';
    const _label = index % 60;

    const left = UtilService.padWithZero(Math.floor(index / 60)) || '00';
    const right = _label ? UtilService.padWithZero(_label) : '00'

    return left + ':' + right
  }

  static ValidateEmail(email) {
    const validEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return validEmail.test(email);
  }

  static DecimalToHex(s) {
    if (!s) return null;
    function add(x, y) {
      var c = 0, r = [];
      var x = x.split('').map(Number);
      var y = y.split('').map(Number);
      while (x.length || y.length) {
        var s = (x.pop() || 0) + (y.pop() || 0) + c;
        r.unshift(s < 10 ? s : s - 10);
        c = s < 10 ? 0 : 1;
      }
      if (c) r.unshift(c);
      return r.join('');
    }

    var dec = '0';
    s.split('').forEach(function (chr) {
      var n = parseInt(chr, 16);
      for (var t = 8; t; t >>= 1) {
        dec = add(dec, dec);
        if (n & t) dec = add(dec, '1');
      }
    });
    return dec;
  }

  static ConvetImg(cImage) {
    return (cImage && cImage.substring(0, 4) === 'ipfs')
      ? 'https://minedn.io/ipfs/' + cImage.substring(7).replace('ipfs', '')
      : cImage?.replace('ipfs.moralis.io:2053', 'minedn.io')
  }

  static EmojiToString(x) {
    const rex = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/ug;
    const updated = x.replace(rex, match => `[e-${match.codePointAt(0).toString(16)}]`);
    return updated;
  }

  static convertEmoji(str) {
    return str.replace(/\[e-([0-9a-fA-F]+)\]/g, (match, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    );
  }

  static disableHeader(pathname) {
    return pathname?.includes('register') ||
      pathname?.includes('login') ||
      pathname?.includes('forgotPassword') ||
      pathname?.includes('wallet') ||
      pathname?.includes('/gates/') ||
      pathname?.includes('/videos/') ||
      pathname?.includes('/sell/') ||
      pathname === '/'
  }

  static checkMetasalt(address) {
    if (!address) {
      return false
    }
    const token_address = address.toLowerCase();
    return [
      CONFIG.MAIN_MINT721_ADDRESS.toLowerCase(),
      CONFIG.MAIN_MINT1155_ADDRESS.toLowerCase(),
      CONFIG.GOERLI_MINT721_ADDRESS.toLowerCase(),
      CONFIG.GOERLI_MINT1155_ADDRESS.toLowerCase(),
      CONFIG.MUMBAI_MINT721_ADDRESS.toLowerCase(),
      CONFIG.MUMBAI_MINT1155_ADDRESS.toLowerCase(),
      CONFIG.POLYGON_MINT721_ADDRESS.toLowerCase(),
      CONFIG.POLYGON_MINT1155_ADDRESS.toLowerCase(),
    ].includes(token_address)
  }

  static checkNet(address) {
    if (!address) {
      return CONFIG.PROD ? 'eth' : 'goerli'
    }
    const token_address = address.toLowerCase();

    switch (token_address?.toLowerCase()) {
      case CONFIG.MAIN_MINT721_ADDRESS.toLowerCase():
      case CONFIG.MAIN_MINT1155_ADDRESS.toLowerCase():
        return 'eth';

      case CONFIG.GOERLI_MINT721_ADDRESS.toLowerCase():
      case CONFIG.GOERLI_MINT1155_ADDRESS.toLowerCase():
      case CONFIG.POLYGON_MINT721_ADDRESS.toLowerCase():
      case CONFIG.POLYGON_MINT1155_ADDRESS.toLowerCase():
        return CONFIG.PROD ? 'polygon' : 'goerli';

      case CONFIG.MUMBAI_MINT721_ADDRESS.toLowerCase():
      case CONFIG.MUMBAI_MINT1155_ADDRESS.toLowerCase():
        return 'mumbai';

      default:
        return CONFIG.PROD ? 'eth' : 'goerli';
    }
  }

  static CurrencyNetIcon(e) {
    switch (e) {
      case 'polygon':
      case 'mumbai':
        return 'https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png'

      default:
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png';

    }
  }

  static CurrencyIcon(e) {
    const token_address = e.toLowerCase();

    if (CONFIG.PROD) {

      switch (token_address) {
        case CONFIG.MAIN_MINT721_ADDRESS.toLowerCase():
        case CONFIG.MAIN_MINT1155_ADDRESS.toLowerCase():
          return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png';

        case CONFIG.POLYGON_MINT721_ADDRESS.toLowerCase():
        case CONFIG.POLYGON_MINT1155_ADDRESS.toLowerCase():
          return 'https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png';

        default:
          return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png';
      }
    } else {

      switch (token_address) {
        case CONFIG.GOERLI_MINT721_ADDRESS.toLowerCase():
        case CONFIG.GOERLI_MINT1155_ADDRESS.toLowerCase():
          return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png';

        case CONFIG.MUMBAI_MINT721_ADDRESS.toLowerCase():
        case CONFIG.MUMBAI_MINT1155_ADDRESS.toLowerCase():
          return 'https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png';

        default:
          return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png';
      }

    }

  }

  static dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  static tokenIDHexConvert(tokenId) {
    if (tokenId.length < 66) {
      return '0x0' + tokenId.substring(2)
    }
    return tokenId
  }

  static alchemyNet(chain){
    switch (chain) {
      case '0x13881':
      case 'mumbai':
        return Network["MATIC_MUMBAI"];
      case '0x89':
      case 'polygon':
        return Network["MATIC_MAINNET"];
      case '0x5':
      case 'goerli':
        return Network["ETH_GOERLI"];
      case '0x1':
      case 'eth':
      default:
        return Network["ETH_MAINNET"];
    }
  }
}

export default UtilService;