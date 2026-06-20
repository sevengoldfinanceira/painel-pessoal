-- =============================================
-- STORAGE BUCKET: documentos
-- Execute este SQL no Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Criar bucket privado
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', false)
on conflict (id) do nothing;

-- 2. Policy: Upload - usuário autenticated pode enviar arquivos para sua própria pasta
drop policy if exists "Upload own documents" on storage.objects;
create policy "Upload own documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documentos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Policy: Read - usuário autenticated pode ler seus próprios arquivos
drop policy if exists "Read own documents" on storage.objects;
create policy "Read own documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'documentos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy: Delete - usuário autenticated pode deletar seus próprios arquivos
drop policy if exists "Delete own documents" on storage.objects;
create policy "Delete own documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documentos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Update - usuário autenticated pode atualizar seus próprios arquivos
drop policy if exists "Update own documents" on storage.objects;
create policy "Update own documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'documentos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'documentos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
