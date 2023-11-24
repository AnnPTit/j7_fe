import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import {Profile} from 'src/sections/profile/profile';
import {ProfileDetail} from 'src/sections/profile/profile-detail';

const Page = () => (
  <>
    <Head>
      <title>
        Thông tin | Armani Hotel
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <Profile />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <ProfileDetail />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;