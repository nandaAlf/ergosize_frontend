// src/pages/StudyGallery.tsx
import { useNavigate } from "react-router-dom";
// import { STUDIES_BY_CONTINENT, ContinentKey } from '../data/studies';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { useState } from "react";
import { ContinentKey, STUDIES_BY_CONTINENT } from "../utils";
import { countries } from "../utils/countries";
const StudyGallery = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContinentKey>("europe");
  const continents = Object.keys(STUDIES_BY_CONTINENT) as ContinentKey[];

  const handleStudySelect = (studyId: string) => {
    navigate(`/tables/${studyId}`);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Estudios Antropométricos Disponibles
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {continents.map((continent) => (
          <Tab
            key={continent}
            label={STUDIES_BY_CONTINENT[continent].name}
            value={continent}
          />
        ))}
      </Tabs>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {STUDIES_BY_CONTINENT[activeTab].studies.map((study) => (
            <Grid size={{ sm: 6, xs: 12, md: 4 }} key={study.metadata.name}>
              <Card
                onClick={() => handleStudySelect(study.metadata.link)}
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-4px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                {/* {study.image && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={study.image}
                    alt={study.name}
                  />
                )} */}

                <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  {study.metadata.country && (
                    <img
                      loading="lazy"
                      width="20"
                      src={`https://flagcdn.com/w20/${study.metadata.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w40/${study.metadata.code.toLowerCase()}.png 2x`}
                      alt=""
                      style={{ marginRight: 8,marginTop:-5, flexShrink: 0 }}
                    />
                  )}
                  {/* <Typography variant="body1">{study.country}</Typography> */}
                  <Typography gutterBottom variant="h5" component="div">
                    {study.metadata.name}
                  </Typography>
                </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {study.metadata.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={study.metadata.country}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={`Año: ${study.metadata.start_date}`}
                      size="small"
                    />
                    <Chip
                      label={`Muestra: ${study.metadata.size}`}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default StudyGallery;
