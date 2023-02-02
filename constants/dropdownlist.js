
const GATETYPES = [
    {
      value: 'Membership',
      label: 'Membership'
    },
    {
      value: 'Event',
      label: 'Event'
    },
    {
      value: 'Media',
      label: 'Media'
    },
    {
      value: 'Product',
      label: 'Product'
    },
  ]
  const GATESTATUS = [
    {
      value: 'Draft',
      label: 'Draft'
    },
    {
      value: 'Scheduled',
      label: 'Scheduled'
    },
    {
      value: 'Publish',
      label: 'Publish'
    },
    {
      value: 'Unpublish',
      label: 'Unpublish'
    },
  ]
  const CHAINS_PROD = [
    {
      idx: 1,
      key: '0x1',
      value: 'Ethereum',
    },
    {
      idx: 2,
      key: '0x89',
      value: 'Polygon',
    },
    {
      idx: 3,
      key: '0x38',
      value: 'BNB',
    },
  ];

  const CHAINS_TEST = [
    // {
    //   idx: 1,
    //   key: "0x3",
    //   value: "Ropsten",
    // },
    // {
    //   idx: 2,
    //   key: "0x4",
    //   value: "Rinkeby",
    // },
    {
      idx: 1,
      key: '0x5',
      value: 'Goerli',
      chain: 'goerli',
    },
    // {
    //   idx: 2,
    //   key: "0x61",
    //   value: "Test BSC",
    // },
    {
      idx: 2,
      key: '0x13881',
      value: 'Mumbai',
      chain: 'mumbai'
    },

  ];

  const CONTENTTYPES = [
    {
      value: 'video',
      label: 'My Videos',
      icon: 'ic_video.png'
    },
    {
      value: 'Discord',
      label: 'My Discourse',
      icon: 'ic_discord.png'
    },
    {
      value: 'Music',
      label: 'My Music',
      icon: 'ic_music.png'
    },
    {
      value: 'YouTube',
      label: 'YouTube',
      icon: 'ic_youtub.png'
    },
    {
      value: 'QR Code',
      label: 'QR Code',
      icon: 'ic_auth.png'
    },
    {
      value: 'Link',
      label: 'Link',
      icon: 'ic_link.png'
    }
  ]

  const DropdownStyles = {
    option: (base, state) => ({
      ...base,
      background: '#303030',
      // color: "hsl(0, 0%, 50%)",
      color: '#fff',
      borderRadius: state.isFocused ? '0' : 0,
      '&:hover': {
        backgroundColor: '#8364E2',
        color: '#fff'
      }
    }),
    menu: base => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
    }),
    menuList: base => ({
      ...base,
      padding: 0
    }),
    control: (base, state) => ({
      ...base,
      padding: 2,
    })
  };

  export { GATESTATUS, GATETYPES, CHAINS_PROD, CHAINS_TEST, CONTENTTYPES, DropdownStyles }