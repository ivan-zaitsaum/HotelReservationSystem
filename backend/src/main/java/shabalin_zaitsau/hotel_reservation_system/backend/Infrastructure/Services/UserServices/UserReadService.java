package shabalin_zaitsau.hotel_reservation_system.backend.Infrastructure.Services.UserServices;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import shabalin_zaitsau.hotel_reservation_system.backend.Domain.Entities.User;
import shabalin_zaitsau.hotel_reservation_system.backend.Infrastructure.Dto.UserDto.UserMapper;
import shabalin_zaitsau.hotel_reservation_system.backend.Infrastructure.Dto.UserDto.ViewUserDto;
import shabalin_zaitsau.hotel_reservation_system.backend.Infrastructure.Exceptions.EntityNotFoundException;
import shabalin_zaitsau.hotel_reservation_system.backend.Infrastructure.Services.UserServices.interfaces.IUserReadService;
import shabalin_zaitsau.hotel_reservation_system.backend.Infrastructure.Storages.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserReadService implements IUserReadService {

    private final UserRepository userRepository;

    @Override
    public List<ViewUserDto> findAllUsers() {
        return userRepository
                .findAll()
                .stream()
                .map(UserMapper::toUserResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ViewUserDto findUserByEmail(String email) {
        User user = userRepository
                .findUserByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User with email: " + email + " not found"));
        return UserMapper.toUserResponseDto(user);
    }

    @Override
    public ViewUserDto findUserById(UUID userId) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + userId + " doesn't exist"));
        return UserMapper.toUserResponseDto(user);
    }
}
