import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
  } from '@mui/material';
  
  const user = {
    avatar: '/assets/avatars/avatar-anika-visser.png',
    city: 'Ha noi ',
    country: 'Viet Nam',
    jobTitle: 'Senior Developer',
    timezone: 'GTM+7'
  };
  
  export const Profile = () => (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.city} {user.country}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {user.timezone}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        {/* <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button> */}
      </CardActions>
    </Card>
  );