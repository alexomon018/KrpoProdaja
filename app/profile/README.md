# Profile Pages

This directory contains all user profile-related pages for the KrpoProdaja marketplace.

## Pages Overview

### Profile View (`/profile`)
- View user profile information
- Display avatar, name, location, bio
- Show user statistics (active listings, total sales, rating)
- Display contact information (for own profile)
- Edit profile button (for own profile)
- Logout functionality
- Message/view listings buttons (for other users' profiles)

### Profile Edit (`/profile/edit`)
- Edit profile information
- Upload/change avatar
- Update name, email, phone
- Update bio and location
- Cancel and save buttons
- Success/error feedback

## Components Used

Pages use components from:
- `/components/organisms/ProfileView/ProfileView`
- `/components/molecules/AuthForm/ProfileEditForm`
- `/components/molecules/AuthForm/AvatarUpload`

## Backend Integration TODO

Each page includes TODO comments for backend integration:

1. **Profile View Page**
   - Fetch current user profile data
   - Implement logout API call
   - Handle authentication state
   - Support viewing other users' profiles via `/profile/[userId]`

2. **Profile Edit Page**
   - Fetch current user data
   - Implement profile update API
   - Implement avatar upload (file upload or base64)
   - Handle validation errors
   - Redirect after successful save

## Data Structure

```typescript
interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  memberSince: string;
  verified: boolean;
  rating?: number;
  totalSales?: number;
  activeListing?: number;
}
```

## User Flow

```
View Profile:
/profile (logged in user)
/profile/[userId] (other users - TODO)

Edit Profile:
/profile → /profile/edit → /profile (after save)
```

## Features

### Profile View
- ✅ Avatar display with fallback
- ✅ Verified badge
- ✅ Location with icon
- ✅ Member since date
- ✅ Rating display
- ✅ Statistics cards
- ✅ Contact information section
- ✅ Edit profile button
- ✅ Logout functionality

### Profile Edit
- ✅ Avatar upload with preview
- ✅ Image validation (type, size)
- ✅ Basic information form
- ✅ Bio textarea
- ✅ Location input
- ✅ Cancel functionality
- ✅ Success/error feedback

### Avatar Upload
- ✅ Image preview
- ✅ File type validation
- ✅ File size validation (5MB max)
- ✅ Loading state
- ✅ Remove avatar option
- ✅ Drag & drop support (via file input)

## Styling

All components follow the existing design system:
- Tailwind CSS for styling
- Atomic design pattern
- Serbian language for labels and messages
- Mobile-first responsive design
- Card-based layout

## Testing

To test the pages locally:
1. Run `npm run dev`
2. Navigate to `/profile` or `/profile/edit`
3. Interact with forms and observe console logs
4. Test avatar upload with different file types/sizes
5. Check responsive behavior on mobile
