import { Box, Button, Typography } from "@mui/material";

type Product ={
    _id: string,
    id: string,
    title: string,
    desc: string,
    qty: number
    date: Date
  }

const HeaderSection = ({ handleAddClick }: { handleAddClick: (item:Product) => void }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginBottom: "20px" }}
    >
      <Typography variant="h5" component="h4">
        List of Products
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleAddClick({ _id: '', id: '', title: '', desc: '', qty: 0, date: new Date() })}>
        Add Product
      </Button>
    </Box>
  );
};

export default HeaderSection;
