import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

const Footer = ({toggle, dark}) => {
  
  return (
    <footer>
      <Navbar expand='lg' className='d-flex flex-row pageFooter pt-5 bg-theme justify-content-between'>
        <Button variant='outline-primary' size="sm" onClick={toggle}>{dark ? 'Light': 'Dark'} Mode</Button>
        <div>
        Project Explorer &copy; 2022 &#8729; Tofi Agbaje &#8729; BetterChalk.ng
        </div>
      </Navbar>
    </footer>
  );
}

export default Footer;
