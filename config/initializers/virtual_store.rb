module VirtualStore

  def vstr loc, attrs = {}
    self.class_eval do
      serialize loc.to_sym, Hash
    end

    attrs.each do |attr, type|
      self.class_eval do
        delegate attr.to_sym, :to => loc.to_sym, :allow_nil => true
      end

      # add setter
      case type
      when "bool"
        define_method "#{attr}=" do |val|
          self[loc.to_sym] ||= {}
          val = (val == 1 || val == true) ? 1 : 0
          self[loc.to_sym][attr.to_sym] = val
        end
      when "array"
        define_method "#{attr}=" do |val|
          self[loc.to_sym] ||= {}
          val = serialize val, Array
          self[loc.to_sym][attr.to_sym] = val
        end
      else
        define_method "#{attr}=" do |val|
          self[loc.to_sym] ||= {}
          self[loc.to_sym][attr.to_sym] = val
          # serialize self[loc.to_sym][attr.to_sym], Hash
        end
      end

      # Add getter
      case type
      when "bool"
        define_method "#{attr}" do
          return false unless self.send(loc)
          val = self[loc.to_sym][attr.to_sym]
          return (val == true || val == 1) ? true : false
        end
        define_method "#{attr}?" do
          send "#{attr}"
        end
      else
        define_method "#{attr}" do
          return "" unless self.send(loc)
          self[loc.to_sym][attr.to_sym]
        end
      end
    end
  end
end

ActiveSupport.on_load :active_record do
  extend VirtualStore
end
