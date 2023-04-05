

const Overlay = ({ bgColor, textColor, width, height }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleTablClick, defaultOpen, fetchList, balance, images } = useAll();
  const [details, setDetails] = useState([]);
  const [walletBalance, setwalletBalance] = useState("");
  const [image, setImage] = useState("");

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event) => {
    if (event.target.className === "modal") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen === true) {
      defaultOpen();
    }
  }, [isOpen]);

  var authToken = localStorage.getItem("wallet_authToken");
  var tale_wallet_address = localStorage.getItem("tale_wallet_address");

  useEffect(() => {
    async function fetchData() {
      const result = await fetchList(tale_wallet_address, authToken);
      setDetails(result);
    }
    fetchData();

    //fetch balance
    async function fetchBalance() {
      const result = await balance(tale_wallet_address, authToken);
      setwalletBalance(result);
    }
    fetchBalance();
  }, []);

  function fetchimages(hash) {
    const result = images(hash);
    return result;
  }

  return (
    <div>
      <button onClick={handleOpen}>Open Modal</button>
      {isOpen && (
        <div className="modal" onClick={handleClickOutside}>
          <div
            className="modal-content"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              width: width,
              height: height,
            }}
          >
          </div>
        </div>
      )}
    </div>
  );
};

export default Overlay;
