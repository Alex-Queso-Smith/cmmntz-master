CarrierWave.configure do |config|
  if !Rails.env.test?
    config.fog_provider = 'fog/azurerm'
    config.fog_credentials = {
      provider: "azurerm",
      azure_storage_account_name: 'classifilterstore',
      azure_storage_access_key: 'bD3a0DP5fNiy4PaaJr7SND+Ai7BHVVTmPHmsWpT7FYBAGX46MrOz+6b5D7TtyqcGO3bQ962X4w4Ajxf7ij3VmA=='
    }
    config.storage = :fog
    config.fog_directory = Rails.env
  end
end
