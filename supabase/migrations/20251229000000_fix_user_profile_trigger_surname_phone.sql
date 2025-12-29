-- Fix user profile trigger to include surname and phone from metadata
-- This ensures that when users register, their surname and phone are saved
-- Also handles Google OAuth full_name by splitting it into name and surname

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_name TEXT;
  v_surname TEXT;
  v_full_name TEXT;
BEGIN
  -- Get metadata values
  v_full_name := COALESCE(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name'
  );
  
  -- If we have a full_name but no separate name/surname, split it
  IF v_full_name IS NOT NULL AND NEW.raw_user_meta_data ->> 'name' IS NULL AND NEW.raw_user_meta_data ->> 'surname' IS NULL THEN
    -- Split full_name: first word is name, rest is surname
    v_name := trim(split_part(v_full_name, ' ', 1));
    v_surname := trim(substring(v_full_name from length(v_name) + 2));
    -- If surname is empty after splitting, set it to empty string
    IF v_surname = '' THEN
      v_surname := NULL;
    END IF;
  ELSE
    -- Use separate name and surname if available, otherwise fallback
    v_name := COALESCE(
      NEW.raw_user_meta_data ->> 'name',
      split_part(v_full_name, ' ', 1),
      split_part(NEW.email, '@', 1)
    );
    v_surname := COALESCE(
      NEW.raw_user_meta_data ->> 'surname',
      CASE 
        WHEN v_full_name IS NOT NULL AND position(' ' in v_full_name) > 0 
        THEN trim(substring(v_full_name from position(' ' in v_full_name) + 1))
        ELSE NULL
      END
    );
  END IF;
  
  -- Insert into user_profiles with all available metadata
  INSERT INTO public.user_profiles (user_id, email, name, surname, phone)
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_surname,
    NEW.raw_user_meta_data ->> 'phone'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    surname = COALESCE(EXCLUDED.surname, user_profiles.surname),
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
    name = COALESCE(EXCLUDED.name, user_profiles.name),
    email = COALESCE(EXCLUDED.email, user_profiles.email),
    updated_at = now();
  
  -- Insert default user role (only if it doesn't exist)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;
